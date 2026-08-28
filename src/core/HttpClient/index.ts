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
	}
}

type LockManagerLike = {
	request(name: string, callback: () => Promise<void>): Promise<void>;
};

@injectable()
export class HttpClient {
	public client: AxiosInstance;
	private static refreshing: Promise<void> | null = null;
	private static readonly REFRESH_LOCK = 'uspacy-token-refresh';

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
		await this.ensureFreshToken();
		const token = await this.tokenService.getToken();
		const apiUrlFromLocalStorage = typeof window !== 'undefined' ? JSON.parse(localStorage?.getItem('REACT_APP_FORCE_API_URL')) : null;

		if (useAuth) {
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
		if (error.response?.status === 401 && error.config && !error.config._retry) {
			error.config._retry = true;
			const usedToken = String(error.config.headers?.Authorization || '').replace('Bearer ', '');

			try {
				await this.withLock(async () => {
					const current = await this.tokenService.getToken();
					if (current && current !== usedToken) return;
					await this.tokenService.refreshToken();
				});

				const token = await this.tokenService.getToken();
				error.config.headers.Authorization = `Bearer ${token}`;
				return this.client(error.config);
			} catch (_error) {
				const status = (_error as AxiosError)?.response?.status;
				if (!this.sessionService.isSetRememberSession() || status === 401) {
					await this.logout();
				}
				throw _error;
			}
		}
		throw error;
	}

	private async logout(): Promise<void> {
		await this.tokenService.removeToken();
		await this.tokenService.removeRefreshToken();
		this.sessionService.removeRememberSession();
		if (typeof window !== 'undefined') {
			setTimeout(() => window.location.reload(), 500);
		}
	}

	private async ensureFreshToken(): Promise<void> {
		if (HttpClient.refreshing) return HttpClient.refreshing;
		if (!(await this.tokenService.isExpired())) return;
		if (HttpClient.refreshing) return HttpClient.refreshing;

		HttpClient.refreshing = this.withLock(async () => {
			if (!(await this.tokenService.isExpired())) return;
			await this.tokenService.refreshToken();
		})
			.catch(() => undefined)
			.finally(() => {
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
