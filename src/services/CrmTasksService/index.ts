import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { ICalendar, ICalendarsAccount, ICalendarsAccounts, ICalendarsSuccessResponse } from '../../models/calendars';
import { IMassActions } from '../../models/crm-mass-actions';
import { ITask, ITasks } from '../../models/crm-tasks';
import { ICalendarSettings, ISyncSettings } from './calendars-settings.dto';

/**
 * CrmTasks service
 */
@injectable()
export class CrmTasksService {
	private namespace = '/activities/v1/activities';
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
	getTasksWithFilters(params: string, signal: AbortSignal) {
		return this.httpClient.client.get<ITasks>(`${this.namespace}?${params}`, {
			signal: signal,
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
	 * Get calendars accounts
	 * @returns calendars accounts list
	 */
	getCalendarsAccounts() {
		return this.httpClient.client.get<ICalendarsAccounts>(`${this.calendarsNamespace}/accounts`);
	}

	/**
	 * Get google calendars
	 * @returns google calendars list
	 */
	getGoogleCalendars() {
		return this.httpClient.client.get<ICalendar[]>(`${this.calendarsNamespace}/google/calendar_list`);
	}

	/**
	 * Save calendar settings
	 * @param body calendar settings
	 * @returns google calendars list
	 */
	saveCalendarSettings(body: ICalendarSettings) {
		return this.httpClient.client.post<ICalendarsAccount>(`${this.calendarsNamespace}/google/save`, body);
	}

	/**
	 * Start initial google calendars sync
	 * @param body initial sync settings
	 */
	startInitialGoogleCalendarsSync(body: ISyncSettings) {
		return this.httpClient.client.post<ICalendarsSuccessResponse>(`${this.calendarsNamespace}/google/initial_sync`, body);
	}

	/**
	 * Start calendars sync
	 * @param body sync settings
	 */
	startCalendarsSync() {
		return this.httpClient.client.get<ICalendarsSuccessResponse>(`${this.calendarsNamespace}/sync`);
	}

	/**
	 * Stop calendars sync
	 */
	stopGoogleCalendarsSync() {
		return this.httpClient.client.patch<ICalendarsSuccessResponse>(`${this.calendarsNamespace}/google/stop_sync`);
	}

	/**
	 * Activate calendars sync
	 */
	activateGoogleCalendarsSync(id: number) {
		return this.httpClient.client.patch<ICalendarsSuccessResponse>(`${this.calendarsNamespace}/google/activate_sync/:id`, undefined, {
			urlParams: { id },
		});
	}

	/**
	 * Delete calendars account
	 */
	deleteCalendarsAccount() {
		return this.httpClient.client.delete<ICalendarsSuccessResponse>(`${this.calendarsNamespace}/accounts/google`);
	}
}
