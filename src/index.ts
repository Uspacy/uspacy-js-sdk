import 'reflect-metadata';

import { container, singleton } from 'tsyringe';

import { ConfigService, IConfig } from './core/ConfigService';
import { HttpClient } from './core/HttpClient';
import { SessionService } from './core/SessionService';
import { TokensService } from './core/TokensService';
import { AuthService } from './services/AuthService';
import { CommentsService } from './services/CommentsService';
import { DepartmentsService } from './services/DepartmentsService';
import { InvatesService } from './services/InvatesService';
import { ProfileService } from './services/ProfileService';
import { TasksService } from './services/TasksService';
import { TasksStagesService } from './services/TasksStagesService';
import { TasksTimerService } from './services/TasksTimerService';
import { UsersService } from './services/UsersService';

@singleton()
class Uspacy {
	constructor(
		public readonly httpClient: HttpClient,
		public readonly authService: AuthService,
		public readonly tokensService: TokensService,
		public readonly sessionService: SessionService,
		public readonly usersService: UsersService,
		public readonly departmentsService: DepartmentsService,
		public readonly profileService: ProfileService,
		public readonly invatesService: InvatesService,
		public readonly commentsService: CommentsService,
		public readonly tasksService: TasksService,
		public readonly tasksStagesService: TasksStagesService,
		public readonly tasksTimerService: TasksTimerService,
	) {}

	static createInstance(config?: IConfig) {
		container.register(ConfigService, { useValue: new ConfigService(config) });
		return container.resolve(this);
	}
}

export default Uspacy;
export const uspacySdk = Uspacy.createInstance();
