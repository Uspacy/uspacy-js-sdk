import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IStage, IStages } from '../../models/tasks-stages';

/**
 * Tasks stages service
 */
@injectable()
export class TasksStagesService {
	private namespace = '/tasks/v1/stages';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get stages list
	 * @param groupId groupId param for filtering kanban stages
	 * @returns Array tasks kanban stages entity
	 */
	getTasksStages(groupId: number) {
		return this.httpClient.client.get<IStages>(this.namespace, { ...(groupId && { params: { groupId } }) });
	}

	/**
	 * Create stage
	 * @param data stage data
	 * @returns new stage entity
	 */
	createTasksStage(data: Partial<IStage>) {
		return this.httpClient.client.post<IStage>(this.namespace, data);
	}

	/**
	 * Update stage
	 * @param id stage id
	 * @returns stage entity
	 */
	updateTasksStage(id: string, data: Partial<IStage>) {
		return this.httpClient.client.patch<IStage>(`${this.namespace}/:id`, data, { urlParams: { id } });
	}

	/**
	 * Delete stage
	 * @param id stage id
	 */
	deleteTasksStage(id: string) {
		return this.httpClient.client.delete(`${this.namespace}/:id`, { urlParams: { id } });
	}
}
