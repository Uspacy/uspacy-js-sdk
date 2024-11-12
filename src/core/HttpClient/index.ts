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

@injectable()
export class HttpClient {
	public client: AxiosInstance;
	private static isBusy = false;
	private static readonly MAX_RETRY_CHECK_BUSY = 5;

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
		await this.resolveBusy();

		if (useAuth) {
			const token = await this.tokenService.getToken();
			if (token) {
				if (!config.headers?.Authorization) {
					config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
				}
			}
			if (!config.baseURL) {
				const decodedToken = await this.tokenService.decodeToken(token);
				config.baseURL = `https://${decodedToken.domain}`;
			}
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
		HttpClient.isBusy = false;
		return response;
	}

	private async handleResponseError(error: AxiosError): Promise<unknown> {
		if (error.response?.status === 401 && error.config && !error.config._retry) {
			error.config._retry = true;
			try {
				const data = await this.tokenService.refreshToken();
				await this.tokenService.setToken(data.jwt);
				error.config.headers.Authorization = `Bearer ${data.jwt}`;
				return this.client(error.config);
			} catch (_error) {
				await this.logout();
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

	private async resolveBusy(): Promise<void> {
		if (HttpClient.isBusy) {
			await this.whenWillIdle();
		} else {
			HttpClient.isBusy = true;
			if (await this.tokenService.isExpired()) {
				try {
					await this.tokenService.refreshToken();
				} finally {
					HttpClient.isBusy = false;
				}
			} else {
				HttpClient.isBusy = false;
			}
		}
	}

	private async whenWillIdle(): Promise<void> {
		let retries = 0;
		while (HttpClient.isBusy && retries < HttpClient.MAX_RETRY_CHECK_BUSY) {
			await new Promise((resolve) => setTimeout(resolve, retries * 500));
			retries++;
		}
		if (HttpClient.isBusy) {
			throw new Error('Timeout waiting for HttpClient to be idle');
		}
	}
}
