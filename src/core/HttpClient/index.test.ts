import 'reflect-metadata';

import type { AxiosAdapter, AxiosRequestConfig, AxiosResponse, AxiosStatic, InternalAxiosRequestConfig } from 'axios';

import type { ISessionStorage } from '../../models/session-storage';
import type { IStorageService } from '../../models/storage-service';

const REFRESH_URL = '/auth/v1/auth/refresh_token';
const API_URL = '/crm/v1/entities/deals';
const PUBLIC_URL = '/announce';
const TARIFF_ERROR = { errors: { text: ['The number of users in the tariff is exceeded!'] }, status: true };
const UNAUTHORIZED = { message: 'Unauthorized' };
const START = Date.UTC(2026, 8, 22, 9, 0, 0);
const DAY = 24 * 60 * 60;

type RefreshReply = number | 'network';

interface ISdk {
	axios: AxiosStatic;
	HttpClient: typeof import('./index').HttpClient;
	ConfigService: typeof import('../ConfigService').ConfigService;
	SessionService: typeof import('../SessionService').SessionService;
	SessionStorage: typeof import('../SessionStorage').SessionStorage;
	TokensService: typeof import('../TokensService').TokensService;
}

let tokenId = 0;
const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
// jwt-decode only reads the payload, so the signature doesn't matter here
const createJwt = (exp: number) => {
	const payload = { exp, domain: 'portal.uspacy.test', jti: ++tokenId };
	return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.signature`;
};

class MemoryStorage implements IStorageService {
	private items = new Map<string, unknown>();

	async setItem<T>(key: string, value: T) {
		this.items.set(key, value);
		return value;
	}

	async getItem<T>(key: string) {
		return this.items.get(key) as T;
	}

	async removeItem(key: string) {
		this.items.delete(key);
	}
}

const cleanups: Array<() => void> = [];

// A minimal Web Locks API (navigator.locks): callbacks for the same lock run one after another
const installWebLocks = () => {
	let queue: Promise<unknown> = Promise.resolve();
	const locks = {
		request: (_name: string, callback: () => Promise<void>) => {
			const result = queue.then(callback);
			queue = result.catch(() => undefined);
			return result;
		},
	};
	const target = (globalThis.navigator as object) ?? globalThis;
	const key = globalThis.navigator ? 'locks' : 'navigator';
	Object.defineProperty(target, key, { value: key === 'locks' ? locks : { locks }, configurable: true });
	cleanups.push(() => delete target[key]);
};

// HttpClient keeps the refresh state in static fields, so every test loads its own copy of the modules
const loadSdk = () => {
	let sdk: ISdk;
	jest.isolateModules(() => {
		sdk = {
			axios: require('axios').default,
			HttpClient: require('./index').HttpClient,
			ConfigService: require('../ConfigService').ConfigService,
			SessionService: require('../SessionService').SessionService,
			SessionStorage: require('../SessionStorage').SessionStorage,
			TokensService: require('../TokensService').TokensService,
		};
	});
	return sdk;
};

const setup = async ({ rememberSession = true, tokenExpired = true, apiAcceptsToken = !tokenExpired, webLocks = false } = {}) => {
	if (webLocks) installWebLocks();
	const clock = { now: START };
	jest.spyOn(Date, 'now').mockImplementation(() => clock.now);
	const nowInSeconds = () => Math.floor(clock.now / 1000);

	const sdk = loadSdk();
	const { AxiosError } = sdk.axios;

	const server = {
		validJwt: '',
		refreshReplies: [] as RefreshReply[],
		refreshCalls: 0,
		refreshGate: Promise.resolve(),
		apiAuthorizations: [] as string[],
	};

	const reply = (config: InternalAxiosRequestConfig, status: number, data: unknown): Promise<AxiosResponse> => {
		const response = { data, status, statusText: String(status), headers: {}, config };
		if (status < 400) return Promise.resolve(response);
		const code = status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST;
		return Promise.reject(new AxiosError(`Request failed with status code ${status}`, code, config, {}, response));
	};

	const adapter: AxiosAdapter = async (config) => {
		if (config.url === REFRESH_URL) {
			server.refreshCalls++;
			await server.refreshGate;
			const next = server.refreshReplies.shift() ?? 200;
			if (next === 'network') throw new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, {});
			if (next !== 200) return reply(config, next, { 401: UNAUTHORIZED, 403: TARIFF_ERROR }[next] ?? { message: 'Server Error' });
			server.validJwt = createJwt(nowInSeconds() + DAY);
			return reply(config, 200, { jwt: server.validJwt, refreshToken: createJwt(nowInSeconds() + 14 * DAY), expiresInSeconds: DAY });
		}
		const authorization = String(config.headers?.Authorization ?? '');
		server.apiAuthorizations.push(authorization);
		if (config.url === PUBLIC_URL || authorization === `Bearer ${server.validJwt}`) return reply(config, 200, { ok: true });
		return reply(config, 401, UNAUTHORIZED);
	};
	// refresh_token goes through the global axios instance, the API requests through HttpClient's own instance
	sdk.axios.defaults.adapter = adapter;

	const session: ISessionStorage & { remembered: boolean } = {
		remembered: rememberSession,
		setRememberSession() {
			this.remembered = true;
		},
		removeRememberSession() {
			this.remembered = false;
		},
		isSetRememberSession() {
			return this.remembered;
		},
	};
	const configService = new sdk.ConfigService({ storageService: new MemoryStorage(), sessionStorageService: session });
	const sessionService = new sdk.SessionService(new sdk.SessionStorage(configService));
	const tokensService = new sdk.TokensService(sessionService, configService);
	const httpClient = new sdk.HttpClient(tokensService, configService, sessionService);

	const initialJwt = createJwt(nowInSeconds() + (tokenExpired ? -60 : 60 * 60));
	await tokensService.setToken(initialJwt);
	await tokensService.setRefreshToken(createJwt(nowInSeconds() + 14 * DAY));
	if (apiAcceptsToken) server.validJwt = initialJwt;

	return {
		server,
		session,
		tokensService,
		initialJwt,
		request: (url = API_URL, config: AxiosRequestConfig = {}) => httpClient.client.get(url, config),
		advance: (ms: number) => {
			clock.now += ms;
		},
		expectLoggedOut: async () => {
			expect(await tokensService.getToken()).toBeFalsy();
			expect(await tokensService.getRefreshToken()).toBeFalsy();
			expect(session.isSetRememberSession()).toBe(false);
		},
	};
};

afterEach(() => {
	jest.restoreAllMocks();
	cleanups.splice(0).forEach((cleanup) => cleanup());
});

describe('HttpClient token refresh', () => {
	describe('refresh_token rejected with 401/403 ends the session', () => {
		it.each([
			[403, TARIFF_ERROR],
			[401, UNAUTHORIZED],
		])('%i: logs out once, passes the reason on and never calls refresh_token again', async (status, data) => {
			const ctx = await setup();
			ctx.server.refreshReplies.push(status); // any later refresh would succeed

			const results = await Promise.allSettled([ctx.request(), ctx.request(), ctx.request()]);

			expect(ctx.server.refreshCalls).toBe(1);
			results.forEach((result) => {
				expect(result).toMatchObject({ status: 'rejected', reason: { config: { url: REFRESH_URL }, response: { status, data } } });
			});
			expect(ctx.server.apiAuthorizations).not.toContain(`Bearer ${ctx.initialJwt}`);
			await ctx.expectLoggedOut();

			await Promise.allSettled([ctx.request(), ctx.request()]);
			ctx.advance(10 * 60 * 1000);
			await Promise.allSettled([ctx.request()]);
			expect(ctx.server.refreshCalls).toBe(1);
		});

		it('logs out when refresh_token answers 403 after an API 401', async () => {
			const ctx = await setup({ tokenExpired: false, apiAcceptsToken: false, webLocks: true });
			ctx.server.refreshReplies.push(403);

			await expect(ctx.request()).rejects.toMatchObject({ response: { status: 403, data: TARIFF_ERROR } });
			expect(ctx.server.refreshCalls).toBe(1);
			await ctx.expectLoggedOut();

			await Promise.allSettled([ctx.request(), ctx.request()]);
			expect(ctx.server.refreshCalls).toBe(1);
		});
	});

	describe('transient refresh failures', () => {
		it.each<[string, RefreshReply, object]>([
			['503', 503, { response: { status: 503 } }],
			['network error', 'network', { code: 'ERR_NETWORK' }],
		])('%s: keeps the session and retries refresh_token only after a growing delay', async (_, failure, expectedError) => {
			const ctx = await setup();
			ctx.server.refreshReplies.push(failure, failure);

			await expect(ctx.request()).rejects.toMatchObject(expectedError);
			expect(ctx.server.refreshCalls).toBe(1);
			expect(ctx.server.apiAuthorizations).toEqual([]);

			await expect(ctx.request()).rejects.toMatchObject(expectedError);
			ctx.advance(1999);
			await expect(ctx.request()).rejects.toMatchObject(expectedError);
			expect(ctx.server.refreshCalls).toBe(1);

			ctx.advance(1); // 2s after the first failure
			await expect(ctx.request()).rejects.toMatchObject(expectedError);
			expect(ctx.server.refreshCalls).toBe(2);

			ctx.advance(3999); // the second failure pauses refreshing for 4s
			await expect(ctx.request()).rejects.toMatchObject(expectedError);
			expect(ctx.server.refreshCalls).toBe(2);

			// the expired token was never sent and the session was kept
			expect(ctx.server.apiAuthorizations).toEqual([]);
			expect(await ctx.tokensService.getToken()).toBe(ctx.initialJwt);
			expect(ctx.session.isSetRememberSession()).toBe(true);

			ctx.advance(1);
			await expect(ctx.request()).resolves.toMatchObject({ status: 200 });
			expect(ctx.server.refreshCalls).toBe(3);
			expect(ctx.server.apiAuthorizations).toEqual([`Bearer ${ctx.server.validJwt}`]);
		});

		it('does not block requests that do not use the session token', async () => {
			const ctx = await setup();
			ctx.server.refreshReplies.push(503);

			await expect(ctx.request(PUBLIC_URL, { useAuth: false })).resolves.toMatchObject({ status: 200 });
			expect(ctx.server.refreshCalls).toBe(1);
			expect(ctx.session.isSetRememberSession()).toBe(true);
		});
	});

	describe('single flight', () => {
		it('shares one refresh between concurrent requests with an expired token', async () => {
			const ctx = await setup();
			let release: () => void;
			ctx.server.refreshGate = new Promise((resolve) => (release = resolve));

			const requests = Array.from({ length: 5 }, () => ctx.request());
			await new Promise((resolve) => setImmediate(resolve));
			release();
			const responses = await Promise.all(requests);

			expect(ctx.server.refreshCalls).toBe(1);
			expect(responses.map((response) => response.status)).toEqual([200, 200, 200, 200, 200]);
			expect(new Set(ctx.server.apiAuthorizations)).toEqual(new Set([`Bearer ${ctx.server.validJwt}`]));
		});

		it.each([false, true])('shares one refresh between concurrent 401 responses (Web Locks API: %s)', async (webLocks) => {
			const ctx = await setup({ tokenExpired: false, apiAcceptsToken: false, webLocks });

			const responses = await Promise.all(Array.from({ length: 5 }, () => ctx.request()));

			expect(ctx.server.refreshCalls).toBe(1);
			expect(responses.map((response) => response.status)).toEqual([200, 200, 200, 200, 200]);
		});
	});

	describe('unchanged behaviour', () => {
		it('sends a valid token without refreshing', async () => {
			const ctx = await setup({ tokenExpired: false });

			await expect(ctx.request()).resolves.toMatchObject({ status: 200 });
			expect(ctx.server.refreshCalls).toBe(0);
			expect(ctx.server.apiAuthorizations).toEqual([`Bearer ${ctx.initialJwt}`]);
		});

		it('refreshes an expired token before the request and stores the new token', async () => {
			const ctx = await setup();

			await expect(ctx.request()).resolves.toMatchObject({ status: 200 });
			expect(ctx.server.refreshCalls).toBe(1);
			expect(ctx.server.apiAuthorizations).toEqual([`Bearer ${ctx.server.validJwt}`]);
			expect(await ctx.tokensService.getToken()).toBe(ctx.server.validJwt);
		});

		it('refreshes and retries the request once after an API 401', async () => {
			const ctx = await setup({ tokenExpired: false, apiAcceptsToken: false });

			await expect(ctx.request()).resolves.toMatchObject({ status: 200 });
			expect(ctx.server.refreshCalls).toBe(1);
			expect(ctx.server.apiAuthorizations).toEqual([`Bearer ${ctx.initialJwt}`, `Bearer ${ctx.server.validJwt}`]);
		});

		it('logs out a session without remember-me on the first 401, without calling refresh_token', async () => {
			const ctx = await setup({ rememberSession: false });

			await expect(ctx.request()).rejects.toBeInstanceOf(Error);
			expect(ctx.server.refreshCalls).toBe(0);
			expect(ctx.server.apiAuthorizations).toEqual([`Bearer ${ctx.initialJwt}`]);
			await ctx.expectLoggedOut();
		});
	});
});
