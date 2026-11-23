import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { TokensService } from '../../core/TokensService';
import { IFirebaseAuth, IFirebaseCustomToken } from '../../models/firebase';
import { IJwt } from '../../models/jwt';

// Renew the session this long before it ends, so Firestore never sees it lapse
const SESSION_RENEW_MARGIN = 10 * 60 * 1000;
// Every Firestore access asks for a session, so a failed exchange is not repeated for this long
const SESSION_RETRY_DELAY = 60 * 1000;

interface IFirebaseSession {
	pending?: Promise<void>;
	retryAt: number;
	renewTimer?: ReturnType<typeof setTimeout>;
}

type SignInWithCustomToken<A> = (auth: A, customToken: string) => Promise<unknown>;

/**
 * Firebase service
 */
@injectable()
export class FirebaseService {
	private namespace = '/settings-backend/v1/firebase';
	private sessions = new Map<IFirebaseAuth, IFirebaseSession>();

	constructor(
		private httpClient: HttpClient,
		private tokensService: TokensService,
	) {}

	/**
	 * Exchange the platform token for a Firebase custom token of the same portal and user
	 * @returns custom token and the session end
	 */
	getCustomToken() {
		return this.httpClient.client.post<IFirebaseCustomToken>(`${this.namespace}/token`);
	}

	/**
	 * Sign the Firebase app in as the current portal and user, unless it already is, and renew the session before it ends.
	 * Errors are logged, not thrown: Firestore then answers as its rules decide.
	 * @param auth - getAuth(app) of the app that reads Firestore
	 * @param signInWithCustomToken - signInWithCustomToken from the same firebase/auth copy as auth
	 * @param decodedToken - the current platform token, when the caller has it decoded already
	 */
	ensureSession<A extends IFirebaseAuth>(auth: A, signInWithCustomToken: SignInWithCustomToken<A>, decodedToken?: IJwt): Promise<void> {
		let session = this.sessions.get(auth);
		if (!session) {
			session = { retryAt: 0 };
			this.sessions.set(auth, session);
		}
		if (!session.pending && Date.now() >= session.retryAt) {
			const current = session;
			current.pending = this.startSession(auth, signInWithCustomToken, current, decodedToken).finally(() => {
				current.pending = undefined;
			});
		}
		return session.pending ?? Promise.resolve();
	}

	/**
	 * Stop the renewals and sign out every Firebase app that asked for a session.
	 * Settles once every app is done; rejects with the first failure.
	 */
	async signOut() {
		const auths = [...this.sessions.keys()];
		this.sessions.forEach((session) => clearTimeout(session.renewTimer));
		this.sessions.clear();
		const results = await Promise.allSettled(auths.map((auth) => auth.signOut()));
		const failed = results.find((result): result is PromiseRejectedResult => result.status === 'rejected');
		if (failed) throw failed.reason;
	}

	private async startSession<A extends IFirebaseAuth>(
		auth: A,
		signInWithCustomToken: SignInWithCustomToken<A>,
		session: IFirebaseSession,
		decodedToken?: IJwt,
	) {
		try {
			const { domain, id } = decodedToken || (await this.tokensService.decodeToken());
			let sessionEnd = await this.getSessionEnd(auth, domain, id).catch(() => 0);
			if (sessionEnd - SESSION_RENEW_MARGIN <= Date.now()) {
				const { data } = await this.getCustomToken();
				if (this.isDropped(auth, session)) return;
				await signInWithCustomToken(auth, data.token);
				// The sign-out may have landed before this sign-in, which would outlive the logout in the browser
				if (this.isDropped(auth, session)) {
					await auth.signOut();
					return;
				}
				sessionEnd = data.sessionExp * 1000;
			}

			session.retryAt = 0;
			clearTimeout(session.renewTimer);
			if (this.isDropped(auth, session)) return;
			session.renewTimer = setTimeout(() => this.ensureSession(auth, signInWithCustomToken), sessionEnd - SESSION_RENEW_MARGIN - Date.now());
		} catch (e) {
			session.retryAt = Date.now() + SESSION_RETRY_DELAY;
			// eslint-disable-next-line no-console
			console.error(e, 'firebase session error');
		}
	}

	// signOut() dropped the session while it was being started
	private isDropped(auth: IFirebaseAuth, session: IFirebaseSession) {
		return this.sessions.get(auth) !== session;
	}

	private async getSessionEnd(auth: IFirebaseAuth, domain: string, id: number) {
		await auth.authStateReady();
		const claims = (await auth.currentUser?.getIdTokenResult())?.claims;
		return claims?.portal === domain && claims?.userId === String(id) ? Number(claims.sessionExp) * 1000 || 0 : 0;
	}
}
