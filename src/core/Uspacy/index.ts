import { container, singleton } from 'tsyringe';

import { AuthService } from '../../services/AuthService';
import { UsersService } from '../../services/UsersService';
import { ConfigService, IConfig } from '../ConfigService';
import { SessionService } from '../SessionService';
import { TokensService } from '../TokensService';

@singleton()
export class Uspacy {
	constructor(
		public readonly authService: AuthService,
		public readonly tokensService: TokensService,
		public readonly sessionService: SessionService,
		public readonly usersService: UsersService,
	) {}

	static createInstance(config?: IConfig) {
		container.register(ConfigService, { useValue: new ConfigService(config) });
		return container.resolve(this);
	}
}
