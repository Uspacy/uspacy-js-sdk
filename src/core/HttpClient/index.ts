import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { injectable } from 'tsyringe';

import { ConfigService } from '../ConfigService';
import { SessionService } from '../SessionService';
import { TokensService } from '../TokensService';

declare module 'axios' {
	interface AxiosRequestConfig {
		urlParams?: Record<string, string | number>;
		_retry?: boolean;
		useAuth?: boolean;
		authToken?: string;
	}
}

type LockManagerLike = {
	request(name: string, callback: () => Promise<void>): Promise<void>;
};

/**
 * refresh_token answered 401/403: auth-service rejected the refresh token or the session
 * (expired or invalid token, "The number of users in the tariff is exceeded!", ...), so the session can't continue
 */
const isSessionRejected = (error: unknown) => {
	const status = (error as AxiosError)?.response?.status;
	return status === 401 || status === 403;
};

@injectable()
export class HttpClient {
	public client: AxiosInstance;
	private static refreshing: Promise<void> | null = null;
	private static refreshFailures = 0;
	private static refreshPausedUntil = 0;
	private static lastRefreshError: unknown = null;
	private static readonly REFRESH_LOCK = 'uspacy-token-refresh';
	private static readonly REFRESH_RETRY_DELAY = 2000;
	private static readonly REFRESH_RETRY_MAX_DELAY = 60000;

	constructor(
		private tokenService: TokensService,
		private configService: ConfigService,
		private sessionService: SessionService,
	) {
		this.client = axios.create({
			...this.configService.config?.httpClientConfig,
		});

		this.setupInterceptors();
	}

	private setupInterceptors(): void {
		this.client.interceptors.request.use(this.handleRequest.bind(this), this.handleRequestError.bind(this));

		this.client.interceptors.response.use(this.handleResponse.bind(this), this.handleResponseError.bind(this));
	}

	private async handleRequest(config: AxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
		// by default useAuth = true;
		const useAuth = config.useAuth !== false;
		try {
			await this.ensureFreshToken();
		} catch (error) {
			// Don't send the expired session token after a failed refresh (a 401/403 has already logged out).
			// A refresh refused without a request (no remember-me session) is left to the 401 handling, as before
			if (useAuth && !config.authToken && axios.isAxiosError(error)) throw error;
		}
		const token = await this.tokenService.getToken();
		const apiUrlFromLocalStorage = typeof window !== 'undefined' ? JSON.parse(localStorage?.getItem('REACT_APP_FORCE_API_URL')) : null;

		if (config.authToken) {
			config.headers = { ...config.headers, Authorization: `Bearer ${config.authToken}` };
		} else if (useAuth) {
			if (token) {
				if (!config.headers?.Authorization) {
					config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
				}
			}
		}

		if (!!apiUrlFromLocalStorage) {
			if (!!apiUrlFromLocalStorage?.allowOnlyForPaths.length) {
				apiUrlFromLocalStorage?.allowOnlyForPaths.forEach((allowedPath: string) => {
					if (config.url?.includes(allowedPath)) {
						config.baseURL = apiUrlFromLocalStorage.url;
					}
				});
			} else {
				config.baseURL = apiUrlFromLocalStorage.url;
			}
		} else if (!config.baseURL && token) {
			const decodedToken = await this.tokenService.decodeToken(token);
			config.baseURL = `https://${decodedToken.domain}`;
		}

		if (config.url && config.urlParams) {
			config.url = Object.entries(config.urlParams).reduce(
				(url, [key, value]) => url.replace(`:${key}`, encodeURIComponent(String(value))),
				config.url,
			);
		}
		return config as InternalAxiosRequestConfig;
	}

	private async handleRequestError(error: unknown): Promise<never> {
		if (error instanceof AxiosError && error.response?.status === 401) {
			await this.logout();
		}
		throw error;
	}

	private handleResponse(response: AxiosResponse): AxiosResponse {
		return response;
	}

	private async handleResponseError(error: AxiosError): Promise<unknown> {
		// handleRequest rethrows refresh errors: a 401 of refresh_token itself must not start another refresh
		const isRefreshRequest = !!error.config?.url?.includes('/auth/refresh_token');
		if (error.response?.status === 401 && error.config && !error.config._retry && !error.config.authToken && !isRefreshRequest) {
			error.config._retry = true;
			const usedToken = String(error.config.headers?.Authorization || '').replace('Bearer ', '');

			try {
				await this.refreshSession(async () => {
					const current = await this.tokenService.getToken();
					return !current || current === usedToken;
				});

				const token = await this.tokenService.getToken();
				error.config.headers.Authorization = `Bearer ${token}`;
				return this.client(error.config);
			} catch (_error) {
				// a 401/403 of the refresh has already logged out in refreshSession
				if (!isSessionRejected(_error) && !this.sessionService.isSetRememberSession()) {
					await this.logout();
				}
				throw _error;
			}
		}
		throw error;
	}

	private async logout(): Promise<void> {
		// the session is over: the next one starts without its refresh backoff
		HttpClient.refreshFailures = 0;
		HttpClient.refreshPausedUntil = 0;
		HttpClient.lastRefreshError = null;
		await this.tokenService.removeToken();
		await this.tokenService.removeRefreshToken();
		this.sessionService.removeRememberSession();
		if (typeof window !== 'undefined') {
			setTimeout(() => window.location.reload(), 500);
		}
	}

	private async ensureFreshToken(): Promise<void> {
		if (!HttpClient.refreshing && !(await this.tokenService.isExpired())) return;
		await this.refreshSession(() => this.tokenService.isExpired());
	}

	/**
	 * One refresh at a time for all requests (and all tabs, through the lock). A 401/403 ends the session.
	 * Any other failure (5xx, network error, timeout) pauses refreshing for 2s, 4s, ... up to 60s instead of retrying on every request
	 */
	private refreshSession(isNeeded: () => Promise<boolean>): Promise<void> {
		if (HttpClient.refreshing) return HttpClient.refreshing;
		if (Date.now() < HttpClient.refreshPausedUntil) return Promise.reject(HttpClient.lastRefreshError);

		HttpClient.refreshing = this.withLock(async () => {
			try {
				if (await isNeeded()) await this.tokenService.refreshToken();
				HttpClient.refreshFailures = 0;
			} catch (error) {
				if (isSessionRejected(error)) {
					// still inside the lock, so other tabs waiting for it find the session already ended
					await this.logout();
				} else if (axios.isAxiosError(error)) {
					const delay = Math.min(HttpClient.REFRESH_RETRY_DELAY * 2 ** HttpClient.refreshFailures, HttpClient.REFRESH_RETRY_MAX_DELAY);
					HttpClient.refreshFailures++;
					HttpClient.refreshPausedUntil = Date.now() + delay;
					HttpClient.lastRefreshError = error;
				}
				throw error;
			}
		}).finally(() => {
			HttpClient.refreshing = null;
		});

		return HttpClient.refreshing;
	}

	private async withLock(run: () => Promise<void>): Promise<void> {
		const locks = (globalThis.navigator as unknown as { locks?: LockManagerLike })?.locks;
		if (!locks) {
			await run();
			return;
		}
		await locks.request(HttpClient.REFRESH_LOCK, run);
	}
}
