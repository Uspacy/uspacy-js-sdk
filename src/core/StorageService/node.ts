global['UspacyNodeStorage'] = {};
/**
 * Default node storage service
 */
export class NodeStorageService {
	private store = global['UspacyNodeStorage'];

	getItem<T>(key: string): Promise<T> {
		return new Promise((resolve) => resolve(this.store[key]));
	}

	setItem<T>(key: string, value: T): Promise<T> {
		this.store[key] = value;
		return Promise.resolve(value);
	}
	removeItem(key: string): Promise<void> {
		if (this.store[key]) delete this.store[key];
		return Promise.resolve();
	}
}
