import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { ICalendarsSuccessResponse, IGoogleCalendar, IGoogleCalendarsAccount } from '../../models/calendars';
import { ITaskFilters } from '../../models/crm-filters';
import { IMassActions } from '../../models/crm-mass-actions';
import { ITask, ITasks } from '../../models/crm-tasks';
import { ICalendarSettings, ISyncSettings } from './calendars-settings.dto';

/**
 * CrmTasks service
 */
@injectable()
export class CrmTasksService {
	private namespace = '/crm/v1/static/tasks';
	private entitiesNamespace = '/crm/v1/entities';
	private calendarsNamespace = '/activities/v1/calendars';

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
	getTasksWithFilters(params: Omit<ITaskFilters, 'openDatePicker'>, signal: AbortSignal) {
		return this.httpClient.client.get<ITasks>(this.namespace, {
			signal: signal,
			params,
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
		return this.httpClient.client.delete(`${this.namespace}/mass_deletion${params}`, {
			data: { all, entity_ids: entityIds, except_ids: exceptIds },
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
		return this.httpClient.client.patch(`${this.namespace}/mass_edit${params}`, {
			all,
			entity_ids: entityIds,
			except_ids: exceptIds,
			payload,
			settings,
		});
	}

	/**
	 * Get OAuth 2.0 redirect url
	 * @returns redirect url
	 */
	getOAuth2CalendarRedirectUrl() {
		return this.httpClient.client.get<{ link: string }>(`${this.calendarsNamespace}/oauth/google/redirect`);
	}

	/**
	 * Get google calendars accounts
	 * @returns google calendars accounts list
	 */
	getGoogleCalendarsAccounts() {
		return this.httpClient.client.get<IGoogleCalendarsAccount[]>(`${this.namespace}/accounts`);
	}

	/**
	 * Get google calendars
	 * @returns google calendars list
	 */
	getGoogleCalendars() {
		return this.httpClient.client.get<IGoogleCalendar[]>(`${this.namespace}/google/calendar_list`);
	}

	/**
	 * Save calendar settings
	 * @param body calendar settings
	 * @returns google calendars list
	 */
	saveCalendarSettings(body: ICalendarSettings) {
		return this.httpClient.client.post<IGoogleCalendarsAccount>(`${this.namespace}/google/save`, body);
	}

	/**
	 * Start initial google calendars sync
	 * @param body initial sync settings
	 */
	startInitialGoogleCalendarsSync(body: ISyncSettings) {
		return this.httpClient.client.post<ICalendarsSuccessResponse>(`${this.namespace}/google/initial_sync`, body);
	}

	/**
	 * Start google calendars sync
	 * @param body sync settings
	 */
	startGoogleCalendarsSync() {
		return this.httpClient.client.get<ICalendarsSuccessResponse>(`${this.namespace}/google/sync`);
	}

	/**
	 * Delete google calendars account
	 * @param email user email
	 */
	deleteGoogleCalendarsAccount(email: string) {
		return this.httpClient.client.delete<ICalendarsSuccessResponse>(`${this.namespace}/accounts/:email`, {
			params: { email },
		});
	}
}
