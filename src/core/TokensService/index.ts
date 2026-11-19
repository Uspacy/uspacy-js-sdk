import axios, { AxiosError } from 'axios';
import decode from 'jwt-decode';
import { injectable } from 'tsyringe';

import { IJwt, IResponseJwt } from '../../models/jwt';
import {
	IAccessTokenResponse,
	ISessionBlockedDetail,
	SESSION_BLOCKED_EVENT,
	SESSION_BLOCKING_CODES,
	SESSION_HEADER,
	SessionTransport,
} from '../../models/session';
import { ConfigService } from '../ConfigService';
import { SessionService } from '../SessionService';
import { StorageService } from '../StorageService';

/**
 * Http client
 */
@injectable()
export class TokensService {
	/**
	 * Share of the access token's lifetime after which it is refreshed
	 */
	private static readonly REFRESH_AT = 0.8;
	/**
	 * Seconds an access token is used before an early refresh
	 */
	private static readonly MIN_REFRESH_AGE = 60;
	private storageService: StorageService;
	constructor(
		private sessionService: SessionService,
		private configService: ConfigService,
	) {
		this.storageService = new StorageService('tokens', configService);
	}

	setToken(token: string) {
		return this.storageService.setItem('token', token);
	}

	getToken(): Promise<string> {
		return this.storageService.getItem('token');
	}

	removeToken(): Promise<void> {
		return this.storageService.removeItem('token');
	}

	setRefreshToken(token: string): Promise<string> {
		return this.storageService.setItem('refreshToken', token);
	}

	getRefreshToken(): Promise<string> {
		return this.storageService.getItem('refreshToken');
	}

	removeRefreshToken(): Promise<void> {
		return this.storageService.removeItem('refreshToken');
	}

	decodeToken(t?: string): Promise<IJwt> {
		return new Promise(async (resolve, reject) => {
			try {
				const token = t || (await this.getToken());
				if (!token) throw new Error('Token not provided');
				resolve(decode(token));
			} catch (e) {
				reject(e);
			}
		});
	}

	decodeRefreshToken(t?: string): Promise<IJwt> {
		return new Promise(async (resolve, reject) => {
			try {
				const token = t || (await this.getRefreshToken());
				if (!token) throw new Error('Token not provided');
				resolve(decode(token));
			} catch (e) {
				reject(e);
			}
		});
	}

	/**
	 * Where the refresh token is: `bearer` when the token storage has one (as before),
	 * `cookie` when the portal's HttpOnly cookie holds it. Cookie mode needs a browser on the portal host
	 * of a server-side session (an access token with `sid`); anything else stays `bearer`.
	 */
	async getTransport(): Promise<SessionTransport> {
		if (await this.getRefreshToken()) return 'bearer';
		if (typeof window === 'undefined' || !window.location) return 'bearer';
		try {
			const jwt = await this.decodeToken();
			if (jwt.sid && jwt.domain === window.location.hostname) return 'cookie';
		} catch (_) {}
		return 'bearer';
	}

	/**
	 * A refresh may be tried: always in cookie mode (the cookie and the server's session decide how long it lasts),
	 * in bearer mode only with "remember me", as before
	 */
	async canRefresh(): Promise<boolean> {
		if ((await this.getTransport()) === 'cookie') return true;
		return !!this.sessionService.isSetRememberSession();
	}

	refreshToken(forceRefresh = false): Promise<IResponseJwt> {
		return new Promise(async (resolve, reject) => {
			try {
				const transport = await this.getTransport();
				if (transport === 'bearer' && !this.sessionService.isSetRememberSession() && !forceRefresh) return reject(new Error(''));
				const result = transport === 'cookie' ? await this.refreshWithCookie() : await this.refreshWithBearer();
				resolve(result);
			} catch (err) {
				this.notifyIfBlocked(err);
				reject(err);
			}
		});
	}

	private async refreshWithBearer(): Promise<IResponseJwt> {
		const token = await this.getRefreshToken();
		const decodedToken = await this.decodeRefreshToken(token);
		const result = await axios.post<IResponseJwt>(
			'/auth/v1/auth/refresh_token',
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				baseURL: this.getBaseURL(decodedToken.domain),
			},
		);
		await this.setToken(result.data.jwt);
		// The server rotates the refresh token: keep the new one
		if (result.data.refreshToken) await this.setRefreshToken(result.data.refreshToken);
		return result.data;
	}

	private async refreshWithCookie(): Promise<IResponseJwt> {
		const result = await axios.post<IResponseJwt>(
			'/auth/v1/auth/refresh_token',
			{},
			{
				headers: {
					[SESSION_HEADER]: 'cookie',
				},
				withCredentials: true,
				baseURL: this.getBaseURL(await this.getDomain()),
			},
		);
		await this.setToken(result.data.jwt);
		return result.data;
	}

	/**
	 * Ends the session on the server (`POST /auth/v1/auth/logout`): the cookie in cookie mode,
	 * otherwise the refresh token (or the access token). Never throws; local tokens stay.
	 * @returns true when the server answered
	 */
	async revokeSession(): Promise<boolean> {
		try {
			if ((await this.getTransport()) === 'cookie') {
				await axios.post(
					'/auth/v1/auth/logout',
					{},
					{ headers: { [SESSION_HEADER]: 'cookie' }, withCredentials: true, baseURL: this.getBaseURL(await this.getDomain()) },
				);
				return true;
			}
			const token = (await this.getRefreshToken()) || (await this.getToken());
			if (!token) return false;
			await axios.post(
				'/auth/v1/auth/logout',
				{},
				{ headers: { Authorization: `Bearer ${token}` }, baseURL: this.getBaseURL(await this.getDomain(token)) },
			);
			return true;
		} catch (_) {
			return false;
		}
	}

	/**
	 * Exchanges the one-time code of a sign-in with `transport: 'handoff'` on the portal page:
	 * the server sets the session cookie and returns the access token. From then on the session is in cookie mode.
	 */
	async exchangeHandoffCode(code: string): Promise<IAccessTokenResponse> {
		const result = await axios.post<IAccessTokenResponse>(
			'/auth/v1/auth/handoff/exchange',
			{ code },
			{
				headers: { [SESSION_HEADER]: 'cookie' },
				withCredentials: true,
				baseURL: this.configService.config?.httpClientConfig?.baseURL || (typeof window !== 'undefined' ? window.location.origin : undefined),
			},
		);
		// The cookie holds the refresh token now; a stored one would keep the session in bearer mode
		await this.removeRefreshToken();
		await this.setToken(result.data.jwt);
		return result.data;
	}

	private getBaseURL(domain?: string) {
		return this.configService.config?.httpClientConfig?.baseURL || (domain ? `https://${domain}` : undefined);
	}

	/**
	 * A refresh refused until the user confirms the email or sets up 2FA: tell the app instead of signing out
	 */
	private notifyIfBlocked(err: unknown) {
		const code = TokensService.getErrorCode(err);
		if (!code || !SESSION_BLOCKING_CODES.includes(code) || typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;
		const detail: ISessionBlockedDetail = { code, status: (err as AxiosError).response?.status, data: (err as AxiosError).response?.data };
		window.dispatchEvent(new CustomEvent(SESSION_BLOCKED_EVENT, { detail }));
	}

	/**
	 * The machine-readable code of an auth error response (`code` or `errors.code`)
	 */
	static getErrorCode(err: unknown): string | undefined {
		const data = (err as AxiosError<{ code?: string; errors?: { code?: string } }>)?.response?.data;
		if (!data || typeof data !== 'object') return undefined;
		return data.code || data.errors?.code;
	}

	/**
	 * The access token is in the last 20% of its lifetime and at least a minute old, or expired: time to refresh it.
	 * The minute keeps a token that the server shortened to its session's end from being refreshed on every request.
	 */
	async isExpiring(ratio = TokensService.REFRESH_AT): Promise<boolean> {
		try {
			const jwt = await this.decodeToken();
			const now = Date.now() / 1000;
			if (!jwt.iat || jwt.iat >= jwt.exp || jwt.exp <= now) return jwt.exp < Math.floor(now);
			return now >= jwt.iat + (jwt.exp - jwt.iat) * ratio && now - jwt.iat >= TokensService.MIN_REFRESH_AGE;
		} catch (_) {
			return false;
		}
	}

	/**
	 * There is an access token close to its expiry, and it may be refreshed
	 */
	async needsRefresh(): Promise<boolean> {
		return (await this.isExpiring()) && (await this.canRefresh());
	}

	async isExpired() {
		try {
			const jwt = await this.decodeToken();
			return jwt.exp < Math.floor(Date.now() / 1000);
		} catch (_) {
			return false;
		}
	}

	async getDomain(t?: string) {
		try {
			const data = await this.decodeToken(t);
			return data.domain;
		} catch (_) {
			return undefined;
		}
	}

	async getUserRoles(t?: string) {
		try {
			const data = await this.decodeToken(t);
			return data.roles;
		} catch (_) {
			return undefined;
		}
	}
}
