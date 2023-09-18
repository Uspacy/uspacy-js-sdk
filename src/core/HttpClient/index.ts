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
						config.headers.Authorization = `Bearer ${token}`;
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
			(res) => res,
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
		if (HttpClient.busy) {
			await this.whenWillIdle();
		} else {
			HttpClient.busy = true;
		}
		if (await this.tokenService.isExpired()) {
			try {
				await this.tokenService.refreshToken();
			} catch (_error) {
				Promise.reject(_error);
			} finally {
				HttpClient.busy = false;
			}
		} else {
			HttpClient.busy = false;
		}
	}

	private async checkBusyRecursively(tryCheckCount: number, resolve: (value: boolean) => void, reject: () => void) {
		try {
			switch (true) {
				case !HttpClient.busy:
					return resolve(true);
				case tryCheckCount >= 3:
					return reject();
				default: {
					setTimeout(() => {
						tryCheckCount++;
						this.checkBusyRecursively(tryCheckCount, resolve, reject);
					}, tryCheckCount * 500);
				}
			}
		} catch (err) {
			reject();
		}
	}

	private whenWillIdle() {
		return new Promise((resolve, reject) => {
			const tryCheckCount = 0;
			this.checkBusyRecursively(tryCheckCount, resolve, reject);
		});
	}
}