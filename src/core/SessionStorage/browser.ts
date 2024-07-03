import cookie from 'js-cookie';
import { injectable } from 'tsyringe';

import { ISessionStorage } from '../../models/session-storage';
import { ConfigService } from '../ConfigService';

/**
 * Default browser session storage service
 */
@injectable()
export class BrowserSessionStorage implements ISessionStorage {
	private KEY: string;
	private expires: number = 30;
	constructor(private readonly configService: ConfigService) {
		this.KEY = `${this.configService.config.appPrefix}.rememberSession`;
	}

	setRememberSession() {
		cookie.set(this.KEY, 'true', {
			expires: this.expires,
			path: '/',
		});
	}

	removeRememberSession() {
		cookie.remove(this.KEY, {
			expires: this.expires,
			path: '/',
		});
	}

	isSetRememberSession() {
		return !!cookie.get(this.KEY);
	}
}
