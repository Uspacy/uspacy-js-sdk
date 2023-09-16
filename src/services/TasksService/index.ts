import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IResponseWithPagination } from '../../models/response';
import { ITask, ITasks } from '../../models/tasks';
import { ITaskValues } from './dto/create-update-task.dto';

/**
 * Tasks service
 */
@injectable()
export class TasksService {
	private namespace = '/tasks/v1/tasks';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get tasks list with filters
	 * @param params tasks list filter params
	 * @param withoutResponsible withoutResponsible filter param
	 * @returns Array tasks entity
	 */
	getTasksWithFilters(params, withoutResponsible: boolean, signal: AbortSignal) {
		if (withoutResponsible) {
			return this.httpClient.client.get(this.namespace, { params: { ...params, responsible_id: '' }, signal });
		}
		return this.httpClient.client.get<IResponseWithPagination<ITasks>>(this.namespace, { params, signal });
	}

	/**
	 * Get regular tasks list with filters
	 * @param params regular tasks list filter params
	 * @param withoutResponsible withoutResponsible filter param
	 * @returns Array regular tasks entity
	 */
	getRegularTasksWithFilters(params, withoutResponsible: boolean, signal: AbortSignal) {
		return this.httpClient.client.get<IResponseWithPagination<ITasks>>(this.namespace, {
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
			return this.httpClient.client.get<IResponseWithPagination<ITasks>>(this.namespace, {
				params: {
					template_id: id,
					page,
					list,
				},
			});
		}

		return this.httpClient.client.get<IResponseWithPagination<ITasks>>(this.namespace, {
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
	getTask(id: ITask['id']) {
		return this.httpClient.client.get<ITask>(`${this.namespace}/:id/`, {
			urlParams: { id },
		});
	}

	/**
	 * Get template by id
	 * @param id template id
	 * @returns template entity
	 */
	getTemplate(id: ITask['id']) {
		return this.httpClient.client.get<ITask>(`${this.namespace}/:id/`, {
			urlParams: { id },
		});
	}

	/**
	 * Get parentTask by id
	 * @param id parentTask id
	 * @returns parentTask entity
	 */
	getParentTask(id: ITask['id']) {
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
	 * Delete task
	 * @param id task id
	 * @returns task id
	 */
	deleteTask(id: string) {
		return this.httpClient.client.delete<ITask>(`${this.namespace}/:id/`, { urlParams: { id } });
	}

	/**
	 * Mass deletion tasks
	 * @param id task id
	 * @returns task id
	 */
	massDeletionTasks(taskIds: string[], exceptIds: number[], all: boolean, params?: string, withoutResponsible?: boolean) {
		if (all) {
			return this.httpClient.client.post<ITask>(
				`${this.namespace}/mass_deletion/`,
				{ taskIds, exceptIds, all },
				{ params: { params, ...(withoutResponsible && { responsible_id: '' }) } },
			);
		}
		return this.httpClient.client.post<ITask>(`${this.namespace}/mass_deletion/`, { taskIds, exceptIds, all });
	}

	/**
	 * Start task
	 * @param id task id
	 * @returns task entity
	 */
	startTask(id: string) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/:id/start`, {
			urlParams: { id },
		});
	}

	/**
	 * Pause task
	 * @param id task id
	 * @returns task entity
	 */
	pauseTask(id: string) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/:id/pause`, {
			urlParams: { id },
		});
	}

	/**
	 * Watch task
	 * @param id task id
	 * @returns task entity
	 */
	watchTask(id: string) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/:id/watch`, {
			urlParams: { id },
		});
	}

	/**
	 * Unwatch task
	 * @param id task id
	 * @returns task entity
	 */
	unwatchTask(id: string) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/:id/unwatch`, {
			urlParams: { id },
		});
	}

	/**
	 * complete task
	 * @param id task id
	 * @returns task entity
	 */
	completeTask(id: string) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/:id/ready`, {
			urlParams: { id },
		});
	}

	/**
	 * Restart task
	 * @param id task id
	 * @returns task entity
	 */
	restartTask(id: string) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/:id/restart`, {
			urlParams: { id },
		});
	}
}
