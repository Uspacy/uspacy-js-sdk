import decode from 'jwt-decode';
import { injectable, registry } from 'tsyringe';

import { IJwt } from '../../models/jwt';
import { StorageService } from '../StorageService';

/**
 * Http client
 */
@injectable()
@registry([
	{
		token: StorageService,
		useValue: new StorageService('tokens'),
	},
])
export class TokensService {
	constructor(private storageService: StorageService) {}

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

	async isExpiredToken() {
		try {
			const jwt = await this.decodeToken();
			return jwt.exp < Math.floor(Date.now() / 1000);
		} catch (_) {
			return true;
		}
	}

	async getDomain(t?: string) {
		try {
			const data = await this.decodeToken(t);
			return data.domain;
		} catch (_) {}
	}

	async getUserRoles(t?: string) {
		try {
			const data = await this.decodeToken(t);
			return data.roles;
		} catch (_) {}
	}
}
