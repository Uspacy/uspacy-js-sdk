import { injectable } from 'tsyringe';

import { SessionStorage } from '../SessionStorage';

/**
 * Session service
 */
@injectable()
export class SessionService {
	constructor(private readonly sessionStorage: SessionStorage) {}

	setRememberSession() {
		return this.sessionStorage.storage.setRememberSession();
	}

	removeRememberSession() {
		return this.sessionStorage.storage.removeRememberSession();
	}

	isSetRememberSession() {
		return this.sessionStorage.storage.isSetRememberSession();
	}
}
