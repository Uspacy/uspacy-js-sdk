import { injectable } from 'tsyringe';

import { IStorageService } from '../../models/storage-service';
import { ConfigService } from '../ConfigService';
import { BrowserStorageService } from './browser';
import { NodeStorageService } from './node';

/**
 * Storage service
 */
injectable();
export class StorageService {
	private storage: IStorageService;
	constructor(storeName: string, configService: ConfigService) {
		this.storage = this.resolveStorageService(storeName, configService);
	}

	private resolveStorageService(storeName: string, configService: ConfigService) {
		if (configService.config?.storageService) {
			return configService.config.storageService;
		}
		if (typeof window !== 'undefined' && 'indexedDB' in window) {
			return new BrowserStorageService(storeName);
		}
		return new NodeStorageService();
	}

	setItem<T>(key: string, value: T) {
		return this.storage.setItem<T>(key, value);
	}

	getItem<T>(key: string) {
		return this.storage.getItem<T>(key);
	}

	removeItem(key: string) {
		return this.storage.removeItem(key);
	}
}
