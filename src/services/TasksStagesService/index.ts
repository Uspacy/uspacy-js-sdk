import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IResponseWithMeta } from '../../models/response';
import { IStages } from '../../models/tasks-stages';

/**
 * Tasks stages service
 */
@injectable()
export class TasksStagesService {
	private namespace = '/tasks/v1/stages';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get stages list
	 * @returns Array tasks kanban stages entity
	 */
	getTasksStages() {
		return this.httpClient.client.get<IResponseWithMeta<IStages>>(this.namespace);
	}

	/**
	 * Move task from column to other column
	 * @param cardId task id
	 * @param stageId stage or column id
	 */
	moveTask(cardId: string, stageId: string) {
		return this.httpClient.client.post<IResponseWithMeta<IStages>>(
			`${this.namespace}/:id/moveTask`,
			{ id: cardId },
			{
				urlParams: { id: stageId },
			},
		);
	}
}
