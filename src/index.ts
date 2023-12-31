import 'reflect-metadata';

import { container, singleton } from 'tsyringe';

import { ConfigService, IConfig } from './core/ConfigService';
import { HttpClient } from './core/HttpClient';
import { SessionService } from './core/SessionService';
import { TokensService } from './core/TokensService';
import { AppsService } from './services/AppsService';
import { AuthService } from './services/AuthService';
import { CommentsService } from './services/CommentsService';
import { CrmDealsFunnelsService } from './services/CrmDealsFunnelsService';
import { CrmEntitiesService } from './services/CrmEntitiesService';
import { CrmLeadsFunnelsService } from './services/CrmLeadsFunnelsService';
import { DepartmentsService } from './services/DepartmentsService';
import { EmailService } from './services/EmailService';
import { FilesService } from './services/FilesService';
import { GroupsService } from './services/GroupsService';
import { InvatesService } from './services/InvatesService';
import { MessengerService } from './services/MessengerService';
import { MigrationsService } from './services/MigrationsService';
import { NewsFeedService } from './services/NewsFeedService';
import { NotificationsService } from './services/NotificationsService';
import { ProfileService } from './services/ProfileService';
import { RolesService } from './services/RolesService';
import { TasksService } from './services/TasksService';
import { TasksStagesService } from './services/TasksStagesService';
import { TasksTimerService } from './services/TasksTimerService';
import { UsersService } from './services/UsersService';
import { WebhooksService } from './services/WebhooksService';

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
		public readonly appsService: AppsService,
		public readonly tasksService: TasksService,
		public readonly tasksStagesService: TasksStagesService,
		public readonly tasksTimerService: TasksTimerService,
		public readonly groupsService: GroupsService,
		public readonly filesService: FilesService,
		public readonly crmDealsFunnelsService: CrmDealsFunnelsService,
		public readonly crmLeadsFunnelsService: CrmLeadsFunnelsService,
		public readonly webhooksService: WebhooksService,
		public readonly rolesService: RolesService,
		public readonly crmEntitiesService: CrmEntitiesService,
		public readonly notificationsService: NotificationsService,
		public readonly newsFeedService: NewsFeedService,
		public readonly migrationsService: MigrationsService,
		public readonly messengerService: MessengerService,
		public readonly emailService: EmailService,
	) {}

	static createInstance(config?: IConfig) {
		container.register(ConfigService, { useValue: new ConfigService(config) });
		return container.resolve(this);
	}
}

export default Uspacy;
export const uspacySdk = Uspacy.createInstance();
