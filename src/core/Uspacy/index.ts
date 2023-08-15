import { container, singleton } from 'tsyringe';

import { AuthService } from '../../services/AuthService';
import { DepartmentsService } from '../../services/DepartmentsService';
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
		public readonly departmentsService: DepartmentsService,
	) {}

	static createInstance(config?: IConfig) {
		container.register(ConfigService, { useValue: new ConfigService(config) });
		return container.resolve(this);
	}
}
