import 'reflect-metadata';

import type { AxiosAdapter, AxiosResponse, AxiosStatic, InternalAxiosRequestConfig } from 'axios';

import type { ISessionStorage } from '../../models/session-storage';
import type { IStorageService } from '../../models/storage-service';

const HOST = 'portal.uspacy.test';
const LOGOUT_URL = '/auth/v1/auth/logout';
const START = Date.UTC(2026, 10, 19, 9, 0, 0);
const TTL = 24 * 60 * 60;

const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
// jwt-decode only reads the payload, so the signature doesn't matter here
const jwt = (claims: object) => `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(claims)}.signature`;
const iat = Math.floor(START / 1000);
const ACCESS = jwt({ iat, exp: iat + TTL, domain: HOST, sid: 'sid-1', typ: 'access' });
const REFRESH = jwt({ iat, exp: iat + 14 * TTL, domain: HOST, sid: 'sid-1', typ: 'refresh' });

class MemoryStorage implements IStorageService {
	items = new Map<string, unknown>();

	async setItem<T>(key: string, value: T) {
		this.items.set(key, value);
		return value;
	}

	async getItem<T>(key: string) {
		return (this.items.has(key) ? this.items.get(key) : null) as T;
	}

	async removeItem(key: string) {
		this.items.delete(key);
	}
}

class MemorySessionStorage implements ISessionStorage {
	remember = false;
	setRememberSession() {
		this.remember = true;
	}
	removeRememberSession() {
		this.remember = false;
	}
	isSetRememberSession() {
		return this.remember;
	}
}

interface ISentRequest {
	url: string;
	method: string;
	data: Record<string, unknown> | undefined;
	headers: Record<string, unknown>;
	withCredentials: boolean;
	baseURL: string;
}

type Reply = { status: number; data?: unknown };

const setup = ({ remember = false, token = null as string | null, refreshToken = null as string | null } = {}) => {
	(globalThis as unknown as { window: object }).window = {
		location: { hostname: HOST, origin: `https://${HOST}` },
		dispatchEvent: () => true,
	};
	(globalThis as unknown as { localStorage: object }).localStorage = { getItem: () => null };

	const sent: ISentRequest[] = [];
	const replies: Record<string, Reply[]> = {};
	let sdk: {
		axios: AxiosStatic;
		ConfigService: typeof import('../../core/ConfigService').ConfigService;
		SessionStorage: typeof import('../../core/SessionStorage').SessionStorage;
		SessionService: typeof import('../../core/SessionService').SessionService;
		TokensService: typeof import('../../core/TokensService').TokensService;
		HttpClient: typeof import('../../core/HttpClient').HttpClient;
		AuthService: typeof import('./index').AuthService;
		UsersService: typeof import('../UsersService').UsersService;
		SecuritySettingsService: typeof import('../SecuritySettingsService').SecuritySettingsService;
	};
	// HttpClient keeps the refresh state in static fields: every test loads its own modules
	jest.isolateModules(() => {
		sdk = {
			axios: require('axios').default,
			ConfigService: require('../../core/ConfigService').ConfigService,
			SessionStorage: require('../../core/SessionStorage').SessionStorage,
			SessionService: require('../../core/SessionService').SessionService,
			TokensService: require('../../core/TokensService').TokensService,
			HttpClient: require('../../core/HttpClient').HttpClient,
			AuthService: require('./index').AuthService,
			UsersService: require('../UsersService').UsersService,
			SecuritySettingsService: require('../SecuritySettingsService').SecuritySettingsService,
		};
	});
	const { AxiosError } = sdk.axios;

	const adapter: AxiosAdapter = async (config: InternalAxiosRequestConfig) => {
		const url = String(config.url);
		sent.push({
			url,
			method: String(config.method),
			data: config.data ? JSON.parse(config.data) : undefined,
			headers: { ...config.headers },
			withCredentials: !!config.withCredentials,
			baseURL: String(config.baseURL),
		});
		const reply = replies[url.replace(/\/$/, '')]?.shift() ?? { status: 200, data: {} };
		const response: AxiosResponse = { data: reply.data, status: reply.status, statusText: '', headers: {}, config };
		if (reply.status < 400) return response;
		throw new AxiosError(`Request failed with status code ${reply.status}`, AxiosError.ERR_BAD_REQUEST, config, {}, response);
	};
	sdk.axios.defaults.adapter = adapter;

	const storage = new MemoryStorage();
	if (token) storage.items.set('token', token);
	if (refreshToken) storage.items.set('refreshToken', refreshToken);
	const sessionStorage = new MemorySessionStorage();
	sessionStorage.remember = remember;

	const config = new sdk.ConfigService({ storageService: storage, sessionStorageService: sessionStorage });
	const sessionService = new sdk.SessionService(new sdk.SessionStorage(config));
	const tokens = new sdk.TokensService(sessionService, config);
	const httpClient = new sdk.HttpClient(tokens, config, sessionService);
	const auth = new sdk.AuthService(tokens, httpClient, sessionService);
	const users = new sdk.UsersService(httpClient);
	const securitySettings = new sdk.SecuritySettingsService(httpClient);

	const reply = (url: string, ...list: Reply[]) => {
		replies[url] = [...(replies[url] ?? []), ...list];
	};
	const sentTo = (url: string) => sent.filter((request) => request.url.replace(/\/$/, '') === url);

	return { storage, sessionStorage, auth, users, securitySettings, sent, sentTo, reply };
};

beforeEach(() => {
	jest.useFakeTimers({ now: START, doNotFake: ['nextTick', 'setImmediate'] });
});

afterEach(() => {
	jest.useRealTimers();
	delete (globalThis as { window?: unknown }).window;
	delete (globalThis as { localStorage?: unknown }).localStorage;
});

describe('login', () => {
	test('sends rememberMe and client when they are given', async () => {
		const { auth, sentTo, reply } = setup();
		reply('/auth/v1/auth/sign_in', { status: 200, data: { jwt: ACCESS, refreshToken: REFRESH, expireInSeconds: TTL } });

		await auth.login({ email: 'a@b.test', password: 'secret', remember: false, client: 'mobile' });

		expect(sentTo('/auth/v1/auth/sign_in')[0].data).toEqual({ email: 'a@b.test', password: 'secret', rememberMe: false, client: 'mobile' });
	});

	test('sends neither when they are not given, and keeps both tokens as before', async () => {
		const { auth, sentTo, reply, storage } = setup();
		reply('/auth/v1/auth/sign_in', { status: 200, data: { jwt: ACCESS, refreshToken: REFRESH, expireInSeconds: TTL } });

		await auth.login({ email: 'a@b.test', password: 'secret' });

		expect(sentTo('/auth/v1/auth/sign_in')[0].data).toEqual({ email: 'a@b.test', password: 'secret' });
		expect(storage.items.get('token')).toBe(ACCESS);
		expect(storage.items.get('refreshToken')).toBe(REFRESH);
	});

	test('with the cookie transport keeps the access token and drops a stored refresh token', async () => {
		const { auth, sentTo, reply, storage } = setup({ refreshToken: 'stale-refresh-token' });
		reply('/auth/v1/auth/sign_in', { status: 200, data: { jwt: ACCESS, expireInSeconds: TTL } });

		await auth.login({ email: 'a@b.test', password: 'secret', transport: 'cookie' });

		const [request] = sentTo('/auth/v1/auth/sign_in');
		expect(request.data).toMatchObject({ transport: 'cookie' });
		expect(request.headers['X-Uspacy-Session']).toBe('cookie');
		expect(storage.items.get('token')).toBe(ACCESS);
		expect(storage.items.has('refreshToken')).toBe(false);
	});
});

describe('logout', () => {
	test('bearer mode: ends the session on the server with the refresh token, then clears the tokens', async () => {
		const { auth, sentTo, storage, sessionStorage } = setup({ remember: true, token: ACCESS, refreshToken: REFRESH });

		await auth.logout();

		const [request] = sentTo(LOGOUT_URL);
		expect(request.method).toBe('post');
		expect(request.headers.Authorization).toBe(`Bearer ${REFRESH}`);
		expect(request.baseURL).toBe(`https://${HOST}`);
		expect(storage.items.size).toBe(0);
		expect(sessionStorage.remember).toBe(false);
	});

	test('cookie mode: spends the cookie, with no Authorization header', async () => {
		const { auth, sentTo, storage } = setup({ token: ACCESS });

		await auth.logout();

		const [request] = sentTo(LOGOUT_URL);
		expect(request.headers.Authorization).toBeUndefined();
		expect(request.headers['X-Uspacy-Session']).toBe('cookie');
		expect(request.withCredentials).toBe(true);
		expect(storage.items.size).toBe(0);
	});

	test('clears the local tokens when the server call fails (older server, network)', async () => {
		const { auth, reply, storage } = setup({ token: ACCESS, refreshToken: REFRESH });
		reply(LOGOUT_URL, { status: 401 });

		await expect(auth.logout()).resolves.toBeUndefined();

		expect(storage.items.size).toBe(0);
	});
});

describe('handoff', () => {
	test('exchanges the code on this host and switches to cookie mode', async () => {
		const { auth, sentTo, reply, storage } = setup({ refreshToken: 'previous-refresh-token' });
		reply('/auth/v1/auth/handoff/exchange', { status: 200, data: { jwt: ACCESS, expireInSeconds: TTL } });

		const result = await auth.exchangeHandoffCode('one-time-code');

		const [request] = sentTo('/auth/v1/auth/handoff/exchange');
		expect(request.data).toEqual({ code: 'one-time-code' });
		expect(request.headers['X-Uspacy-Session']).toBe('cookie');
		expect(request.withCredentials).toBe(true);
		expect(request.baseURL).toBe(`https://${HOST}`);
		expect(result.jwt).toBe(ACCESS);
		expect(storage.items.get('token')).toBe(ACCESS);
		expect(storage.items.has('refreshToken')).toBe(false);
	});
});

describe('sessions', () => {
	test('list, revoke one, revoke the others', async () => {
		const { auth, sent } = setup({ token: ACCESS, refreshToken: REFRESH });

		await auth.getSessions();
		await auth.revokeSession('sid-2');
		await auth.revokeOtherSessions();

		expect(sent.map(({ method, url }) => `${method} ${url}`)).toEqual([
			'get /auth/v1/auth/sessions',
			'delete /auth/v1/auth/sessions/sid-2',
			'post /auth/v1/auth/sessions/revoke_others',
		]);
		expect(sent.every((request) => request.headers.Authorization === `Bearer ${ACCESS}`)).toBe(true);
	});

	test('changeMyPassword sends logoutOtherSessions to change_password', async () => {
		const { auth, sent } = setup({ token: ACCESS, refreshToken: REFRESH });

		await auth.changeMyPassword('old-secret', 'new-secret', false);

		expect(sent[0]).toMatchObject({
			method: 'patch',
			url: '/auth/v1/users/change_password',
			data: { oldPassword: 'old-secret', newPassword: 'new-secret', logoutOtherSessions: false },
		});
	});
});

describe('email verification and 2FA setup', () => {
	test('resendConfirmation posts the email without the session token', async () => {
		const { auth, sent } = setup({ token: ACCESS, refreshToken: REFRESH });

		await auth.resendConfirmation('a@b.test');

		expect(sent[0]).toMatchObject({ method: 'post', url: '/auth/v1/auth/resend_confirmation', data: { email: 'a@b.test' } });
		expect(sent[0].headers.Authorization).toBeUndefined();
	});

	test('the forced setup step gets the QR code, then confirms and stores the tokens', async () => {
		const { auth, sentTo, reply, storage } = setup();
		reply('/auth/v1/auth/2fa/setup', { status: 200, data: { secretKey: 'KEY', qrCodeUri: 'data:image/png;base64,' } });
		reply('/auth/v1/auth/2fa/setup/confirm', { status: 200, data: { jwt: ACCESS, refreshToken: REFRESH, expireInSeconds: TTL } });

		const qr = await auth.startTwofaSetup('sealed-setup-token');
		await auth.confirmTwofaSetup('sealed-setup-token', '123456', { remember: true });

		expect(qr.data.secretKey).toBe('KEY');
		expect(sentTo('/auth/v1/auth/2fa/setup')[0].data).toEqual({ setupToken: 'sealed-setup-token' });
		expect(sentTo('/auth/v1/auth/2fa/setup/confirm')[0].data).toEqual({ setupToken: 'sealed-setup-token', code: '123456', rememberMe: true });
		expect(storage.items.get('token')).toBe(ACCESS);
		expect(storage.items.get('refreshToken')).toBe(REFRESH);
	});

	test('security settings and the admin 2FA reset with the acting admin code', async () => {
		const { users, securitySettings, sent } = setup({ token: ACCESS, refreshToken: REFRESH });

		await securitySettings.getSecuritySettings();
		await securitySettings.updateSecuritySettings({ twofaRequired: false, code: '123456' });
		await users.disable2Fa(7, '654321');
		await users.disable2Fa(8);

		expect(sent.map(({ method, url, data }) => [method, url, data])).toEqual([
			['get', '/company/v1/security_settings', undefined],
			['patch', '/company/v1/security_settings', { twofaRequired: false, code: '123456' }],
			['patch', '/company/v1/users/7/twofa_disable', { code: '654321' }],
			['patch', '/company/v1/users/8/twofa_disable', {}],
		]);
	});
});
