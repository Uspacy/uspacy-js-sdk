import 'reflect-metadata';

import { container, injectable } from 'tsyringe';

import { ConfigService, IConfig } from './core/ConfigService';
import { HttpClient } from './core/HttpClient';
import { SessionService } from './core/SessionService';
import { TokensService } from './core/TokensService';
import { AnalyticsService } from './services/AnalyticsService';
import { AnnouncersService } from './services/AnnouncersService';
import { AppsService } from './services/AppsService';
import { AuthService } from './services/AuthService';
import { AutomationsService } from './services/AutomationsService';
import { CommentsService } from './services/CommentsService';
import { CrmCallsService } from './services/CrmCallsService';
import { CrmCompaniesService } from './services/CrmCompaniesService';
import { CrmContactsService } from './services/CrmContactsService';
import { CrmDealsFunnelsService } from './services/CrmDealsFunnelsService';
import { CrmDealsService } from './services/CrmDealsService';
import { CrmDealsStagesService } from './services/CrmDealsStagesService';
import { CrmDocumentTemplatesService } from './services/CrmDocumentTemplatesService';
import { CrmEntitiesService } from './services/CrmEntitiesService';
import { CrmLeadsFunnelsService } from './services/CrmLeadsFunnelsService';
import { CrmLeadsService } from './services/CrmLeadsService';
import { CrmLeadsStagesService } from './services/CrmLeadsStagesService';
import { CrmProductsCategoryService } from './services/CrmProductsCategoryService';
import { CrmProductsForEntityService } from './services/CrmProductsForEntityService';
import { CrmProductsService } from './services/CrmProductsService';
import { CrmProductsTaxesService } from './services/CrmProductsTaxesService';
import { CrmProductsUnitService } from './services/CrmProductsUnitService';
import { CrmRequisitesService } from './services/CrmRequisitesService';
import { CrmTasksService } from './services/CrmTasksService';
import { DepartmentsService } from './services/DepartmentsService';
import { EmailService } from './services/EmailService';
import { FilesService } from './services/FilesService';
import { GroupsService } from './services/GroupsService';
import { HistoryService } from './services/HistoryService';
import { InvatesService } from './services/InvatesService';
import { MessengerService } from './services/MessengerService';
import { MigrationsService } from './services/MigrationsService';
import { NewsFeedService } from './services/NewsFeedService';
import { NotificationsService } from './services/NotificationsService';
import { PouchdbService } from './services/PouchdbService';
import { ProfileService } from './services/ProfileService';
import { ResourcesService } from './services/ResourcesService';
import { RolesService } from './services/RolesService';
import { TasksService } from './services/TasksService';
import { TasksStagesService } from './services/TasksStagesService';
import { TasksTimerService } from './services/TasksTimerService';
import { UsersService } from './services/UsersService';
import { WebhooksService } from './services/WebhooksService';

@injectable()
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
		public readonly webhooksService: WebhooksService,
		public readonly rolesService: RolesService,
		public readonly notificationsService: NotificationsService,
		public readonly newsFeedService: NewsFeedService,
		public readonly migrationsService: MigrationsService,
		public readonly messengerService: MessengerService,
		public readonly emailService: EmailService,
		public readonly automationsService: AutomationsService,
		public readonly crmEntitiesService: CrmEntitiesService,
		public readonly crmCallsService: CrmCallsService,
		public readonly crmCompaniesService: CrmCompaniesService,
		public readonly crmContactsService: CrmContactsService,
		public readonly crmDealsService: CrmDealsService,
		public readonly crmLeadsService: CrmLeadsService,
		public readonly crmTasksService: CrmTasksService,
		public readonly crmDealsFunnelsService: CrmDealsFunnelsService,
		public readonly crmLeadsFunnelsService: CrmLeadsFunnelsService,
		public readonly crmDealsStagesService: CrmDealsStagesService,
		public readonly crmLeadsStagesService: CrmLeadsStagesService,
		public readonly crmProductsService: CrmProductsService,
		public readonly crmProductTaxesService: CrmProductsTaxesService,
		public readonly crmProductUnitService: CrmProductsUnitService,
		public readonly crmProductsCategoryService: CrmProductsCategoryService,
		public readonly crmProductsForEntityService: CrmProductsForEntityService,
		public readonly crmDocumentTemplatesService: CrmDocumentTemplatesService,
		public readonly crmRequisitesService: CrmRequisitesService,
		public readonly historyService: HistoryService,
		public readonly analyticsService: AnalyticsService,
		public readonly announcersService: AnnouncersService,
		public readonly resourcesService: ResourcesService,
		public readonly pouchdbService: PouchdbService,
		public readonly resourcesService: ResourcesService,
	) {}

	static createInstance(config?: Omit<IConfig, 'couchDbUrl'>) {
		container.register(ConfigService, { useValue: new ConfigService(config) });
		return container.resolve(this);
	}
}

export default Uspacy;
export const uspacySdk = Uspacy.createInstance();
