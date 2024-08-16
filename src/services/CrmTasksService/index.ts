import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IMassActions } from '../../models/crm-mass-actions';
import { ITask, ITasks } from '../../models/crm-tasks';

/**
 * CrmTasks service
 */
@injectable()
export class CrmTasksService {
	private namespace = '/crm/v1/static/tasks';
	private entitiesNamespace = '/crm/v1/entities';

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
}
