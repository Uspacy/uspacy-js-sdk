import 'reflect-metadata';

import type { AxiosAdapter, AxiosResponse, AxiosStatic, InternalAxiosRequestConfig } from 'axios';

import type { ISessionStorage } from '../../models/session-storage';
import type { IStorageService } from '../../models/storage-service';

const HOST = 'portal.uspacy.test';
const REFRESH_URL = '/auth/v1/auth/refresh_token';
const API_URL = '/crm/v1/entities/deals';
const START = Date.UTC(2026, 10, 19, 9, 0, 0);
const HOUR = 60 * 60;
const TTL = 24 * HOUR;

const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
let tokenId = 0;
// jwt-decode only reads the payload, so the signature doesn't matter here
const jwt = (claims: object) => `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ jti: ++tokenId, ...claims })}.signature`;
const nowSeconds = () => Math.floor(Date.now() / 1000);
const accessToken = ({ sid = 'sid-1' as string | null, age = 0, domain = HOST } = {}) => {
	const iat = nowSeconds() - age;
	return jwt({ iat, exp: iat + TTL, domain, ...(sid && { sid, typ: 'access' }) });
};
const refreshJwt = (sid?: string) =>
	jwt({ iat: nowSeconds(), exp: nowSeconds() + 14 * 24 * HOUR, domain: HOST, ...(sid && { sid, typ: 'refresh' }) });

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
	data: unknown;
	headers: Record<string, unknown>;
	withCredentials: boolean;
	baseURL: string;
}

type Reply = { status: number; data?: unknown };

const setup = ({ remember = false, token = '' as string | null, refreshToken = '' as string | null } = {}) => {
	const events: CustomEvent[] = [];
	(globalThis as unknown as { window: object }).window = {
		location: { hostname: HOST, origin: `https://${HOST}` },
		dispatchEvent: (event: CustomEvent) => events.push(event),
	};
	(globalThis as unknown as { localStorage: object }).localStorage = { getItem: () => null };

	const sent: ISentRequest[] = [];
	const replies: Record<string, Reply[]> = {};
	let sdk: {
		axios: AxiosStatic;
		ConfigService: typeof import('../ConfigService').ConfigService;
		SessionStorage: typeof import('../SessionStorage').SessionStorage;
		SessionService: typeof import('../SessionService').SessionService;
		TokensService: typeof import('./index').TokensService;
		HttpClient: typeof import('../HttpClient').HttpClient;
		AuthService: typeof import('../../services/AuthService').AuthService;
	};
	// HttpClient keeps the refresh state in static fields: every test loads its own modules
	jest.isolateModules(() => {
		sdk = {
			axios: require('axios').default,
			ConfigService: require('../ConfigService').ConfigService,
			SessionStorage: require('../SessionStorage').SessionStorage,
			SessionService: require('../SessionService').SessionService,
			TokensService: require('./index').TokensService,
			HttpClient: require('../HttpClient').HttpClient,
			AuthService: require('../../services/AuthService').AuthService,
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
		const reply = replies[url]?.shift() ?? { status: 200, data: {} };
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

	const reply = (url: string, ...list: Reply[]) => {
		replies[url] = [...(replies[url] ?? []), ...list];
	};
	const sentTo = (url: string) => sent.filter((request) => request.url === url);

	return { sdk, storage, sessionStorage, tokens, httpClient, auth, sent, sentTo, reply, events };
};

beforeEach(() => {
	jest.useFakeTimers({ now: START, doNotFake: ['nextTick', 'setImmediate'] });
});

afterEach(() => {
	jest.useRealTimers();
	delete (globalThis as { window?: unknown }).window;
	delete (globalThis as { localStorage?: unknown }).localStorage;
});

describe('session transport', () => {
	test('a refresh token in storage means bearer mode', async () => {
		const { tokens } = setup({ token: accessToken(), refreshToken: refreshJwt('sid-1') });
		expect(await tokens.getTransport()).toBe('bearer');
	});

	test('no refresh token and a session access token of this host mean cookie mode', async () => {
		const { tokens } = setup({ token: accessToken() });
		expect(await tokens.getTransport()).toBe('cookie');
	});

	test('a token without sid (older server) or of another host stays in bearer mode', async () => {
		expect(await setup({ token: accessToken({ sid: null }) }).tokens.getTransport()).toBe('bearer');
		expect(await setup({ token: accessToken({ domain: 'other.uspacy.test' }) }).tokens.getTransport()).toBe('bearer');
	});
});

describe('refresh', () => {
	test('bearer mode keeps the rotated refresh token', async () => {
		const { tokens, storage, sentTo, reply } = setup({ remember: true, token: accessToken(), refreshToken: refreshJwt('sid-1') });
		const rotated = refreshJwt('sid-1');
		reply(REFRESH_URL, { status: 200, data: { jwt: 'new-access', refreshToken: rotated, expireInSeconds: TTL } });

		await tokens.refreshToken();

		const [request] = sentTo(REFRESH_URL);
		expect(String(request.headers.Authorization)).toMatch(/^Bearer /);
		expect(request.baseURL).toBe(`https://${HOST}`);
		expect(storage.items.get('token')).toBe('new-access');
		expect(storage.items.get('refreshToken')).toBe(rotated);
	});

	test('bearer mode without "remember me" still does not refresh', async () => {
		const { tokens, sent } = setup({ token: accessToken(), refreshToken: refreshJwt('sid-1') });

		await expect(tokens.refreshToken()).rejects.toBeDefined();
		expect(sent).toHaveLength(0);
	});

	test('cookie mode refreshes with the cookie, without "remember me" and without a stored refresh token', async () => {
		const { tokens, storage, sentTo, reply } = setup({ token: accessToken() });
		reply(REFRESH_URL, { status: 200, data: { jwt: 'new-access', expireInSeconds: TTL } });

		await tokens.refreshToken();

		const [request] = sentTo(REFRESH_URL);
		expect(request.headers.Authorization).toBeUndefined();
		expect(request.headers['X-Uspacy-Session']).toBe('cookie');
		expect(request.withCredentials).toBe(true);
		expect(request.baseURL).toBe(`https://${HOST}`);
		expect(storage.items.get('token')).toBe('new-access');
		expect(storage.items.has('refreshToken')).toBe(false);
	});
});

describe('HttpClient', () => {
	test('refreshes the access token at 80% of its lifetime, before it expires', async () => {
		const { httpClient, sentTo, reply, storage } = setup({ token: accessToken({ age: Math.ceil(TTL * 0.85) }) });
		reply(REFRESH_URL, { status: 200, data: { jwt: accessToken(), expireInSeconds: TTL } });

		await httpClient.client.get(API_URL);

		expect(sentTo(REFRESH_URL)).toHaveLength(1);
		expect(String(sentTo(API_URL)[0].headers.Authorization)).toBe(`Bearer ${storage.items.get('token')}`);
	});

	test('does not refresh a token that is younger than 80% of its lifetime', async () => {
		const { httpClient, sentTo } = setup({ token: accessToken({ age: Math.floor(TTL * 0.5) }) });

		await httpClient.client.get(API_URL);

		expect(sentTo(REFRESH_URL)).toHaveLength(0);
	});

	test('a token the server cut short to its session end is not refreshed again within its first minute', async () => {
		const iat = nowSeconds() - 30;
		const { httpClient, sentTo } = setup({ token: jwt({ iat, exp: iat + 35, domain: HOST, sid: 'sid-1', typ: 'access' }) });

		await httpClient.client.get(API_URL);

		expect(sentTo(REFRESH_URL)).toHaveLength(0);
	});

	test('after a failed early refresh the next attempt waits a minute', async () => {
		const { httpClient, sentTo, reply } = setup({ token: accessToken({ age: Math.ceil(TTL * 0.85) }) });
		reply(REFRESH_URL, { status: 503 }, { status: 200, data: { jwt: accessToken(), expireInSeconds: TTL } });

		await httpClient.client.get(API_URL);
		await httpClient.client.get(API_URL);
		expect(sentTo(REFRESH_URL)).toHaveLength(1);

		jest.setSystemTime(Date.now() + 61 * 1000);
		await httpClient.client.get(API_URL);
		expect(sentTo(REFRESH_URL)).toHaveLength(2);
	});

	test('a refresh refused until the email is confirmed keeps the session and tells the app', async () => {
		const { httpClient, reply, storage, events } = setup({ token: accessToken() });
		const blocked = { errors: { text: ['Confirm your email address'], code: 'email_verification_required' }, status: true };
		reply(API_URL, { status: 401 });
		reply(REFRESH_URL, { status: 403, data: blocked });

		await expect(httpClient.client.get(API_URL)).rejects.toMatchObject({ response: { status: 403, data: blocked } });

		expect(storage.items.get('token')).toBeTruthy();
		expect(events).toHaveLength(1);
		expect(events[0].type).toBe('uspacy:session-blocked');
		expect(events[0].detail).toMatchObject({ code: 'email_verification_required', status: 403 });
	});

	test('a refresh refused until 2FA is set up (code at the top level) tells the app too', async () => {
		const { httpClient, reply, storage, events } = setup({ remember: true, token: accessToken(), refreshToken: refreshJwt('sid-1') });
		reply(API_URL, { status: 401 });
		reply(REFRESH_URL, { status: 403, data: { errors: { text: ['2FA required'] }, code: 'twofa_enrollment_required', status: true } });

		await expect(httpClient.client.get(API_URL)).rejects.toBeDefined();

		expect(storage.items.get('refreshToken')).toBeTruthy();
		expect(events.map((event) => event.detail.code)).toEqual(['twofa_enrollment_required']);
	});

	test('cookie mode signs out when the session is over (401 from refresh)', async () => {
		const { httpClient, reply, storage } = setup({ token: accessToken() });
		reply(API_URL, { status: 401 });
		reply(REFRESH_URL, { status: 401 });

		await expect(httpClient.client.get(API_URL)).rejects.toBeDefined();

		expect(storage.items.has('token')).toBe(false);
	});
});
