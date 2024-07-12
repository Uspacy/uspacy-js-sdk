import { ISessionStorage } from '../../models/session-storage';

global['UspacyNodeSessionStorage'] = {};
/**
 * Default node session storage service
 */
export class NodeSessionStorage implements ISessionStorage {
	private store = global['UspacyNodeSessionStorage'];
	private KEY: string = 'rememberSession';
	private KEY_EXPIRED_DATE: string = 'rememberSessionExtireDate';
	private expires: number = 30;

	setRememberSession() {
		this.store[this.KEY] = true;
		this.store[this.KEY_EXPIRED_DATE] = new Date(Date.now() + this.expires * 24 * 60 * 60 * 1000).getTime();
	}

	removeRememberSession() {
		delete this.store[this.KEY];
		delete this.store[this.KEY_EXPIRED_DATE];
	}

	isSetRememberSession() {
		if (this.isExpired()) this.removeRememberSession();
		return !!this.store[this.KEY];
	}

	private isExpired() {
		if (!this.store[this.KEY_EXPIRED_DATE]) return true;
		const expiredDate = this.store[this.KEY_EXPIRED_DATE];
		return expiredDate < Date.now();
	}
}
