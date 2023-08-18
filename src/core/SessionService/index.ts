import { ConfigService } from 'core/ConfigService';
import cookie from 'js-cookie';
import { injectable } from 'tsyringe';

/**
 * Session service
 */
@injectable()
export class SessionService {
	private KEY: string;
	private expires: number = 14;
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
