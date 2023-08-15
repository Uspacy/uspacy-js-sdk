import axios, { AxiosInstance } from 'axios';
import { injectable } from 'tsyringe';

import { ConfigService } from '../ConfigService';
import { TokensService } from '../TokensService';

declare module 'axios' {
	interface AxiosRequestConfig {
		urlParams?: Record<string, string | number>;
	}
}

/**
 * Http client service
 */
@injectable()
export class HttpClient {
	client: AxiosInstance;
	constructor(
		private tokenService: TokensService,
		private configService: ConfigService,
	) {
		this.client = axios.create({
			...this.configService.config?.httpClientConfig,
			withCredentials: false,
		});
		this.client.interceptors.request.use(async (config) => {
			try {
				const token = await this.tokenService.getToken();
				if (token && !config.headers.Authorization) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				if (!config.url) {
					return config;
				}
				Object.entries(config.urlParams || {}).forEach(([k, v]) => {
					config.url = config.url.replace(`:${k}`, encodeURIComponent(v));
				});
				config.url = config.url;
				return config;
			} catch (err) {}
		});
	}
}
