import axios from 'axios';
import decode from 'jwt-decode';
import { injectable } from 'tsyringe';

import { IJwt, IResponseJwt } from '../../models/jwt';
import { ConfigService } from '../ConfigService';
import { SessionService } from '../SessionService';
import { StorageService } from '../StorageService';

/**
 * Http client
 */
@injectable()
export class TokensService {
	private storageService: StorageService = new StorageService('tokens');
	constructor(
		private sessionService: SessionService,
		private configService: ConfigService,
	) {}

	setToken(token: string) {
		return this.storageService.table.setItem('token', token);
	}

	getToken(): Promise<string> {
		return this.storageService.table.getItem('token');
	}

	removeToken(): Promise<void> {
		return this.storageService.table.removeItem('token');
	}

	setRefreshToken(token: string): Promise<string> {
		return this.storageService.table.setItem('refreshToken', token);
	}

	getRefreshToken(): Promise<string> {
		return this.storageService.table.getItem('refreshToken');
	}

	removeRefreshToken(): Promise<void> {
		return this.storageService.table.removeItem('refreshToken');
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

	refreshToken(): Promise<IResponseJwt> {
		return new Promise(async (resolve, reject) => {
			if (!this.sessionService.isSetRememberSession()) return reject(new Error(''));
			try {
				const token = await this.getRefreshToken();
				const decodedToken = await this.decodeRefreshToken(token);
				const result = await axios.post<IResponseJwt>(
					'/auth/v1/auth/refresh_token',
					{},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
						baseURL: this.configService.config?.httpClientConfig?.baseURL || decodedToken.domain,
					},
				);
				await this.setToken(result.data.jwt);
				await this.setRefreshToken(result.data.refreshToken);
				resolve(result.data);
			} catch (err) {
				reject(err);
			}
		});
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
