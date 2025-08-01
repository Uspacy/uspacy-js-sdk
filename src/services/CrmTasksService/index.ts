import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IMassActions } from '../../models/crm-mass-actions';
import { ITask, ITasks } from '../../models/crm-tasks';
import {
	ICalendar,
	ICalendarsSuccessResponse,
	IOAuthServicesAccount,
	ISaveAccountResponse,
	oauthProvider,
	oauthType,
} from '../../models/oauthIntegrations';
import { ITransferActivitiesData, ITransferOfCasesProgress } from '../../models/transferOfCases';
import { ICalendarSettings, ISyncSettings } from './calendars-settings.dto';

/**
 * CrmTasks service
 */
@injectable()
export class CrmTasksService {
	private namespace = '/activities/v1/activities';
	private trashNamespace = '/activities/v1/trash/activities';
	private calendarsNamespace = '/activities/v1/calendars';
	private oauthIntegrationsNamespace = '/activities/v1/integrations';
	private namespaceTransferActivities = '/activities/v1/transfers';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get crm tasks list
	 * @returns Array crm tasks list with meta
	 */
	getTasks() {
		return this.httpClient.client.get<ITasks>(this.namespace, {
			params: {
				list: 100,
			},
		});
	}

	/**
	 * Create task
	 * @param data task data without id
	 * @returns task entity
	 * */
	createTask(data: Partial<ITask>) {
		return this.httpClient.client.post<ITask>(this.namespace, data);
	}

	/**
	 * Get tasks list with filters
	 * @param params tasks list filter params
	 * @param signal AbortSignal for cancelling request
	 * @param relatedEntityId related entity id if fetching related to entity tasks
	 * @param relatedEntityType related entity type if fetching related to entity tasks
	 * @returns Array crm tasks list
	 */
	getTasksWithFilters(params: string | object, signal?: AbortSignal) {
		const suffix = typeof params === 'string' ? `/?${params}` : '';
		return this.httpClient.client.get<ITasks>(`${this.namespace}${suffix}`, {
			signal,
			params: typeof params === 'object' ? params : undefined,
		});
	}

	/**
	 * Update task
	 * @param id task id
	 * @param data task data
	 * @returns task entity
	 */
	updateTask(id: number, data: Partial<ITask>) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Get task
	 * @param id task id
	 * @returns task entity
	 */
	getTask(id: string) {
		return this.httpClient.client.get<ITask>(`${this.namespace}/:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Delete task
	 * @param id task id
	 */
	deleteTask(id: number) {
		return this.httpClient.client.delete<ITask>(`${this.namespace}/:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Mass deleting tasks
	 * @param entityIds task ids to edit
	 * @param exceptIds task ids to exclude from editing
	 * @param all should edit all tasks
	 * @param params query params if editing all tasks
	 */
	massTasksDeletion({ entityIds, exceptIds, all, params }: IMassActions) {
		const data = { all, entity_ids: entityIds, except_ids: exceptIds };
		const suffix = typeof params === 'string' ? `/?${params}` : '';
		return this.httpClient.client.delete(`${this.namespace}/mass_deletion${suffix}`, {
			data,
			params: typeof params === 'object' ? params : undefined,
		});
	}

	/**
	 * Mass editing tasks
	 * @param entityIds task ids to edit
	 * @param exceptIds task ids to exclude from editing
	 * @param all should edit all tasks
	 * @param params query params if editing all tasks
	 * @param payload editing payload
	 * @param settings editing settings
	 */
	massTasksEditing({ entityIds, exceptIds, all, params, payload, settings }: IMassActions) {
		const data = {
			all,
			id: entityIds,
			except_ids: exceptIds,
			payload,
			settings,
		};
		const suffix = typeof params === 'string' ? `/?${params}` : '';
		return this.httpClient.client.patch(`${this.namespace}/mass_edit${suffix}`, data);
	}

	/**
	 * Get OAuth 2.0 redirect url
	 * @returns redirect url
	 */
	getOAuthRedirectUrl(provider: oauthProvider, type: oauthType) {
		return this.httpClient.client.get<{ link: string }>(`${this.oauthIntegrationsNamespace}/${provider}/${type}/oauth/redirect`);
	}

	/**
	 * Get oauth services accounts
	 * @returns oauth services accounts list
	 */
	getOauthServicesAccounts(params?: { with: string[] }) {
		return this.httpClient.client.get<IOAuthServicesAccount>(`${this.oauthIntegrationsNamespace}/accounts`, {
			...(params && { params }),
		});
	}

	/**
	 * Get calendars
	 * @returns calendars list
	 */
	getCalendars() {
		return this.httpClient.client.get<ICalendar[]>(`${this.oauthIntegrationsNamespace}/calendars/google/calendar_list`);
	}

	/**
	 * Save calendars settings
	 * @param body calendars settings
	 * @returns calendars list
	 */
	saveCalendarsSettings(body: ICalendarSettings) {
		return this.httpClient.client.post<ISaveAccountResponse>(`${this.oauthIntegrationsNamespace}/calendars/google/save`, body);
	}

	/**
	 * Start initial account sync
	 * @param body initial sync settings
	 */
	startInitialServicesAccountSync(body: ISyncSettings) {
		return this.httpClient.client.post<ICalendarsSuccessResponse>(`${this.oauthIntegrationsNamespace}/calendars/google/initial_sync`, body);
	}

	/**
	 * Start account sync
	 * @param body sync settings
	 */
	startServicesAccountSync() {
		return this.httpClient.client.get<ICalendarsSuccessResponse>(`${this.oauthIntegrationsNamespace}/calendars/sync`);
	}

	/**
	 * Stop account sync
	 */
	stopServicesAccountSync() {
		return this.httpClient.client.patch<ICalendarsSuccessResponse>(`${this.oauthIntegrationsNamespace}/calendars/google/stop_sync`);
	}

	/**
	 * Activate calendars sync
	 */
	activateServicesAccountSync(id: number) {
		return this.httpClient.client.patch<ICalendarsSuccessResponse>(
			`${this.oauthIntegrationsNamespace}/calendars/google/activate_sync/:id`,
			undefined,
			{
				urlParams: { id },
			},
		);
	}

	/**
	 * Delete services account
	 */
	deleteServicesAccount(providerId: number, integrationId: number) {
		return this.httpClient.client.delete<ICalendarsSuccessResponse>(
			`${this.oauthIntegrationsNamespace}/accounts/${providerId}/integrations/${integrationId}`,
		);
	}

	/**
	 * Transfer activities
	 * @returns transfer activities quantity
	 */
	transferActivities(body: Partial<ITransferActivitiesData>) {
		return this.httpClient.client.post<ITransferActivitiesData>(`${this.namespaceTransferActivities}/user`, body);
	}

	/**
	 * Transfer activities quantity
	 * @returns transfer activities quantity
	 */
	getTransferActivitiesQuantity(body: Partial<ITransferActivitiesData>) {
		return this.httpClient.client.post<ITransferActivitiesData>(`${this.namespaceTransferActivities}/quantity`, body);
	}

	/**
	 * Transfer activities
	 * @returns transfer activities progress
	 */
	getTransferActivitiesProgress() {
		return this.httpClient.client.get<ITransferOfCasesProgress>(`${this.namespaceTransferActivities}/progress`);
	}

	/**
	 * Stop transfer activities
	 */
	stopTransferActivities() {
		return this.httpClient.client.get(`${this.namespaceTransferActivities}/stop`);
	}

	/**
	 * Get deleted(trash) activities
	 * @param params activity list filter params
	 * @param signal AbortSignal for cancelling request
	 * @returns activity list
	 */
	getTrashActivities(params: string | object, signal?: AbortSignal) {
		const suffix = typeof params === 'string' ? `/?${params}` : '';
		return this.httpClient.client.get<ITasks>(`${this.trashNamespace}${suffix}`, {
			signal,
			params: typeof params === 'object' ? params : undefined,
		});
	}

	/**
	 * Get deleted(trash) activity
	 * @param id item id
	 * @returns activity item
	 */
	getTrashActivity(id: number) {
		return this.httpClient.client.get<ITask>(`${this.trashNamespace}`, {
			params: {
				id,
			},
		});
	}

	/**
	 * Restore activities
	 * @param itemIds restore items by ids
	 * @param all all items restore
	 * @param exceptIds items that don't need to be restored
	 * @param filterParams filters
	 */
	restoreTrashActivities({
		itemIds,
		all,
		exceptIds,
		filterParams,
	}: {
		itemIds: number[];
		all: boolean;
		exceptIds: number[];
		filterParams?: object;
	}) {
		return this.httpClient.client.patch(
			`${this.trashNamespace}/restore`,
			{
				id: itemIds,
				all,
				except_ids: exceptIds,
			},
			{
				params: {
					...(filterParams || {}),
				},
			},
		);
	}

	/**
	 * Remove from basket activities
	 * @param itemIds delete items by ids
	 * @param all all items delete
	 * @param exceptIds items that don't need to be delete
	 * @param filterParams filters
	 */
	deleteTrashActivities({
		itemIds,
		all,
		exceptIds,
		filterParams,
	}: {
		itemIds: number[];
		all: boolean;
		exceptIds: number[];
		filterParams?: object;
	}) {
		return this.httpClient.client.delete(`${this.trashNamespace}`, {
			data: {
				id: itemIds,
				all,
				except_ids: exceptIds,
			},
			params: {
				...(filterParams || {}),
			},
		});
	}
}
