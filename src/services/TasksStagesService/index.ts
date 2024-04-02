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
	 * @param groupId groupId param for filtering kanban stages
	 * @returns Array tasks kanban stages entity
	 */
	getTasksStages(groupId: number) {
		return this.httpClient.client.get<IResponseWithMeta<IStages>>(this.namespace, { ...(groupId && { params: { groupId } }) });
	}

	/**
	 * Move task from column to other column
	 * @param cardId task id
	 * @param stageId stage or column id
	 * @param prevCardId previous task id in column
	 */
	moveTask(cardId: string, stageId: string, prevCardId?: string) {
		return this.httpClient.client.post<IResponseWithMeta<IStages>>(
			`${this.namespace}/:id/moveTask`,
			{ id: cardId, ...(prevCardId && { prev_id: prevCardId }) },
			{ urlParams: { id: stageId } },
		);
	}
}
