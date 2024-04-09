import { createInstance } from 'localforage';

/**
 * Default browser storage service
 */
export class BrowserStorageService {
	private table: LocalForage;
	constructor(
		private storeName: string,
		private name = 'Uspacy',
	) {
		this.table = createInstance({
			name: this.name,
			storeName: this.storeName,
		});
	}

	setItem<T>(key: string, value: T) {
		return this.table.setItem<T>(key, value);
	}

	getItem<T>(key: string) {
		return this.table.getItem<T>(key);
	}

	removeItem(key: string) {
		return this.table.removeItem(key);
	}
}
