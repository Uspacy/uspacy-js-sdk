import axios, { AxiosInstance } from 'axios';
import { injectable } from 'tsyringe';

import { ConfigService } from '../ConfigService';
import { SessionService } from '../SessionService';
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
	static busy = false;
	static maxRetryCheckBusy = 5;
	constructor(
		private tokenService: TokensService,
		private configService: ConfigService,
		private sessionService: SessionService,
	) {
		this.client = axios.create({
			...this.configService.config?.httpClientConfig,
			withCredentials: false,
		});

		this.client.interceptors.request.use((config) => {
			return new Promise(async (resolve, reject) => {
				try {
					await this.resolveBusy();
					const token = await this.tokenService.getToken();
					if (token && !config.headers.Authorization) {
						const decodedToken = await this.tokenService.decodeToken(token);
						config.headers.Authorization = `Bearer ${token}`;
						config.baseURL = `https://${decodedToken.domain}`;
					}
					if (config.url) {
						Object.entries(config.urlParams || {}).forEach(([k, v]) => {
							config.url = config.url.replace(`:${k}`, encodeURIComponent(v));
						});
					}
					resolve(config);
				} catch (err) {
					await this.logout();
					reject(err);
				}
			});
		});

		this.client.interceptors.response.use(
			(res) => {
				HttpClient.busy = false;
				return res;
			},
			async (err) => {
				const originalConfig = err.config;
				if (err.response.status === 401 && !originalConfig._retry) {
					originalConfig._retry = true;
					try {
						const data = await this.tokenService.refreshToken();
						originalConfig.headers.Authorization = `Bearer ${data.jwt}`;
						return this.client(originalConfig);
					} catch (_error) {
						await this.logout();
						return Promise.reject(_error);
					}
				}

				return Promise.reject(err);
			},
		);
	}

	async logout() {
		await this.tokenService.removeToken();
		await this.tokenService.removeRefreshToken();
		// clearCacheAfterLogout();
		this.sessionService.removeRememberSession();
		setTimeout(() => {
			window.location.reload();
		}, 500);
	}

	private async resolveBusy() {
		return new Promise(async (resolve, reject) => {
			if (HttpClient.busy) {
				return resolve(await this.whenWillIdle());
			} else {
				HttpClient.busy = true;
			}
			if (await this.tokenService.isExpired()) {
				try {
					await this.tokenService.refreshToken();
					HttpClient.busy = false;
					resolve(true);
				} catch (_error) {
					HttpClient.busy = false;
					reject(_error);
				}
			} else {
				HttpClient.busy = false;
				resolve(true);
			}
		});
	}

	private async checkBusyRecursively(tryCheckCount: number, resolve: (value: boolean) => void, reject: (e: Error) => void) {
		switch (true) {
			case !HttpClient.busy:
				return resolve(true);
			case tryCheckCount >= HttpClient.maxRetryCheckBusy:
				return reject(new Error('timeout'));
			default: {
				setTimeout(() => {
					tryCheckCount++;
					this.checkBusyRecursively(tryCheckCount, resolve, reject);
				}, tryCheckCount * 500);
			}
		}
	}

	private whenWillIdle() {
		return new Promise((resolve, reject) => {
			this.checkBusyRecursively(0, resolve, reject);
		});
	}
}
