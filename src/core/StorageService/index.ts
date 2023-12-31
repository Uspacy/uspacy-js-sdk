import { createInstance } from 'localforage';
import { injectable } from 'tsyringe';

/**
 * Storage service
 */
injectable();
export class StorageService {
	table: LocalForage;
	constructor(
		private storeName: string,
		private name = 'Uspacy',
	) {
		this.table = createInstance({
			name: this.name,
			storeName: this.storeName,
		});
	}
}
