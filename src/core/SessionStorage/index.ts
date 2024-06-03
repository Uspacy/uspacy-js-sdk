import { injectable } from 'tsyringe';

import { ISessionStorage } from '../../models/session-storage';
import { ConfigService } from '../ConfigService';
import { BrowserSessionStorage } from './browser';
import { NodeSessionStorage } from './node';

/**
 * Session storage service
 */
@injectable()
export class SessionStorage {
	storage: ISessionStorage;
	constructor(private readonly configService: ConfigService) {
		this.storage = this.resolveStorageService(configService);
	}

	private resolveStorageService(configService: ConfigService) {
		if (configService.config?.sessionStorageService) {
			return configService.config.sessionStorageService;
		}
		if (typeof window !== 'undefined') {
			return new BrowserSessionStorage(this.configService);
		}
		return new NodeSessionStorage();
	}
}
