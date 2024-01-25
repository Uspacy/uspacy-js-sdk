/* eslint-disable camelcase */
import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IFields } from '../../models/field';
import { IResponseWithMeta } from '../../models/response';
import { ITask, ITasks, ITasksParams } from '../../models/tasks';
import { ITaskValues } from './dto/create-update-task.dto';
import { IMassEditingFieldsPayload } from './dto/mass-actions.dto';

/**
 * Tasks service
 */
@injectable()
export class TasksService {
	private namespace = '/tasks/v1/tasks';
	private namespaceTemplates = '/tasks/v1/templates';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get tasks list with filters
	 * @param params tasks list filter params
	 * @param withoutResponsible withoutResponsible filter param
	 * @returns Array tasks entity
	 */
	getTasks(params: ITasksParams, withoutResponsible: boolean, signal: AbortSignal) {
		return this.httpClient.client.get<IResponseWithMeta<ITasks>>(this.namespace, {
			params: { ...params, ...(withoutResponsible && { responsible_id: '' }) },
			signal,
		});
	}

	/**
	 * Get recurring templates list
	 * @param params recurring templates list
	 * @param withoutResponsible withoutResponsible filter param
	 * @returns Array recurring template entity
	 */
	getRecurringTemplates(params: ITasksParams, withoutResponsible: boolean, signal: AbortSignal) {
		return this.httpClient.client.get<IResponseWithMeta<ITasks>>(`${this.namespaceTemplates}/recurring`, {
			params: { ...params, ...(withoutResponsible && { responsible_id: '' }) },
			signal,
		});
	}

	/**
	 * Get one time templates list
	 * @param params one time templates list
	 * @param withoutResponsible withoutResponsible filter param
	 * @returns Array one time template entity
	 */
	getOneTimeTemplates(params: ITasksParams, withoutResponsible: boolean, signal: AbortSignal) {
		return this.httpClient.client.get<IResponseWithMeta<ITasks>>(`${this.namespaceTemplates}/one_time`, {
			params: { ...params, ...(withoutResponsible && { responsible_id: '' }) },
			signal,
		});
	}

	/**
	 * Get subtasks list
	 * @param id parent task/template id
	 * @param page page number
	 * @param list elements count
	 * @param isTemplate template param
	 * @returns Array subtasks entity
	 */
	getSubtasks(id: string, page: number, list: number, isTemplate: boolean) {
		if (isTemplate) {
			return this.httpClient.client.get<IResponseWithMeta<ITasks>>(this.namespace, {
				params: {
					template_id: id,
					page,
					list,
				},
			});
		}

		return this.httpClient.client.get<IResponseWithMeta<ITasks>>(this.namespace, {
			params: {
				parent_id: id,
				page,
				list,
			},
		});
	}

	/**
	 * Get task by id
	 * @param id task id
	 * @returns task entity
	 */
	getTask(id: string, crm_entity_list?: boolean) {
		return this.httpClient.client.get<ITask>(`${this.namespace}/:id/`, {
			...(crm_entity_list && { params: { crm_entity_list } }),
			urlParams: { id },
		});
	}

	/**
	 * Get recurring template by id
	 * @param id recurring template id
	 * @returns recurring template entity
	 */
	getRecurringTemplate(id: string, crm_entity_list?: boolean) {
		return this.httpClient.client.get<ITask>(`${this.namespace}/recurring/:id/`, {
			...(crm_entity_list && { params: { crm_entity_list } }),
			urlParams: { id },
		});
	}

	/**
	 * Get one time template by id
	 * @param id one time template id
	 * @returns one time template entity
	 */
	getOneTimeTemplate(id: string, crm_entity_list?: boolean) {
		return this.httpClient.client.get<ITask>(`${this.namespace}/one_time/:id/`, {
			...(crm_entity_list && { params: { crm_entity_list } }),
			urlParams: { id },
		});
	}

	/**
	 * Get parentTask by id
	 * @param id parentTask id
	 * @returns parentTask entity
	 */
	getParentTask(id: string) {
		return this.httpClient.client.get<ITask>(`${this.namespace}/:id/`, {
			urlParams: { id },
		});
	}

	/**
	 * Create task
	 * @returns task entity
	 */
	createTask(body: ITaskValues) {
		return this.httpClient.client.post<ITask>(this.namespace, body);
	}

	/**
	 * Create recurring template
	 * @returns recurring template entity
	 */
	createRecurringTemplate(body: ITaskValues) {
		return this.httpClient.client.post<ITask>(`${this.namespace}/recurring`, body);
	}

	/**
	 * Create one time template
	 * @returns one time template entity
	 */
	createOneTimeTemplate(body: ITaskValues) {
		return this.httpClient.client.post<ITask>(`${this.namespace}/one_time`, body);
	}

	/**
	 * Update task
	 * @param id task id
	 * @returns task entity
	 */
	updateTask(id: string, body: ITaskValues) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/:id/`, body, {
			urlParams: { id },
		});
	}

	/**
	 * Update recurring template
	 * @param id recurring template id
	 * @returns recurring template entity
	 */
	updateRecurringTemplate(id: string, body: ITaskValues) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/recurring/:id/`, body, {
			urlParams: { id },
		});
	}

	/**
	 * Update one time template
	 * @param id one time template id
	 * @returns one time template entity
	 */
	updateOneTimeTemplate(id: string, body: ITaskValues) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/one_time/:id/`, body, {
			urlParams: { id },
		});
	}

	/**
	 * Update subtask
	 * @param id subtask id
	 * @returns subtask entity
	 */
	updateSubtask(id: string, body: ITaskValues) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/:id/`, body, {
			urlParams: { id },
		});
	}

	/**
	 * Mass editing tasks
	 * @param taskIds tasks ids
	 * @param exceptIds exception tasks ids
	 * @param all boolean flag for params
	 * @param params params for filters
	 * @param withoutResponsible boolean flag for filters
	 * @param payload mass editing values
	 * @param settings mass editing field settings
	 */
	massEditingTasks(
		taskIds: string[],
		exceptIds: number[],
		all: boolean,
		params?: ITasksParams,
		withoutResponsible?: boolean,
		payload?: IMassEditingFieldsPayload,
		settings?: IMassEditingFieldsPayload,
	) {
		if (all) {
			return this.httpClient.client.post(
				`${this.namespace}/mass_edit/`,
				{ taskIds, exceptIds, all, payload, settings },
				{ params: { ...params, ...(withoutResponsible && { responsible_id: '' }) } },
			);
		}
		return this.httpClient.client.post(`${this.namespace}/mass_edit/`, { taskIds, exceptIds, all, payload, settings });
	}

	/**
	 * Delete task
	 * @param id task id
	 */
	deleteTask(id: string) {
		return this.httpClient.client.delete<ITask>(`${this.namespace}/:id/`, { urlParams: { id } });
	}

	/**
	 * Mass deletion tasks
	 * @param taskIds tasks ids
	 * @param exceptIds exception tasks ids
	 * @param all boolean flag for params
	 * @param params params for filters
	 * @param withoutResponsible boolean flag for filters
	 */
	massDeletionTasks(taskIds: string[], exceptIds: number[], all: boolean, params?: ITasksParams, withoutResponsible?: boolean) {
		if (all) {
			return this.httpClient.client.post(
				`${this.namespace}/mass_deletion/`,
				{ taskIds, exceptIds, all },
				{ params: { ...params, ...(withoutResponsible && { responsible_id: '' }) } },
			);
		}
		return this.httpClient.client.post(`${this.namespace}/mass_deletion/`, { taskIds, exceptIds, all });
	}

	/**
	 * Start task
	 * @param id task id
	 * @returns task entity
	 */
	startTask(id: string) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/:id/start`, undefined, {
			urlParams: { id },
		});
	}

	/**
	 * Pause task
	 * @param id task id
	 * @returns task entity
	 */
	pauseTask(id: string) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/:id/stop`, undefined, {
			urlParams: { id },
		});
	}

	/**
	 * Watch task
	 * @param id task id
	 * @returns task entity
	 */
	watchTask(id: string) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/:id/watch`, undefined, {
			urlParams: { id },
		});
	}

	/**
	 * Unwatch task
	 * @param id task id
	 * @returns task entity
	 */
	unwatchTask(id: string) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/:id/unwatch`, undefined, {
			urlParams: { id },
		});
	}

	/**
	 * complete task
	 * @param id task id
	 * @returns task entity
	 */
	completeTask(id: string) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/:id/ready`, undefined, {
			urlParams: { id },
		});
	}

	/**
	 * Mass completion tasks
	 * @param taskIds tasks ids
	 * @param exceptIds exception tasks ids
	 * @param all boolean flag for params
	 * @param params params for filters
	 * @param withoutResponsible boolean flag for filters
	 */
	massCompletionTasks(taskIds: string[], exceptIds: number[], all: boolean, params?: ITasksParams, withoutResponsible?: boolean) {
		if (all) {
			return this.httpClient.client.post(
				`${this.namespace}/mass_ready/`,
				{ taskIds, exceptIds, all },
				{ params: { ...params, ...(withoutResponsible && { responsible_id: '' }) } },
			);
		}
		return this.httpClient.client.post(`${this.namespace}/mass_ready/`, { taskIds, exceptIds, all });
	}

	/**
	 * Restart task
	 * @param id task id
	 * @returns task entity
	 */
	restartTask(id: string) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/:id/restart`, undefined, {
			urlParams: { id },
		});
	}

	/**
	 * Get tasks fields
	 * @returns tasks fields
	 */
	getTasksField() {
		return this.httpClient.client.get<IFields>(`${this.namespace}/fields`);
	}
}
