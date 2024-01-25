/* eslint-disable camelcase */
import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IResponseWithMeta } from '../../models/response';
import { ITask, ITasks, ITasksParams } from '../../models/tasks';
import { ITaskValues } from '../TasksService/dto/create-update-task.dto';

/**
 * Tasks service
 */
@injectable()
export class TasksTemplatesService {
	private namespace = '/tasks/v1/templates';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get one time templates list
	 * @param params one time templates list
	 * @param withoutResponsible withoutResponsible filter param
	 * @returns Array one time template entity
	 */
	getOneTimeTemplates(params: ITasksParams, withoutResponsible: boolean, signal: AbortSignal) {
		return this.httpClient.client.get<IResponseWithMeta<ITasks>>(`${this.namespace}/one_time`, {
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
		return this.httpClient.client.get<IResponseWithMeta<ITasks>>(`${this.namespace}/recurring`, {
			params: { ...params, ...(withoutResponsible && { responsible_id: '' }) },
			signal,
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
	 * Create one time template
	 * @returns one time template entity
	 */
	createOneTimeTemplate(body: ITaskValues) {
		return this.httpClient.client.post<ITask>(`${this.namespace}/one_time`, body);
	}

	/**
	 * Create recurring template
	 * @returns recurring template entity
	 */
	createRecurringTemplate(body: ITaskValues) {
		return this.httpClient.client.post<ITask>(`${this.namespace}/recurring`, body);
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
	 * Update recurring template
	 * @param id recurring template id
	 * @returns recurring template entity
	 */
	updateRecurringTemplate(id: string, body: ITaskValues) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/recurring/:id/`, body, {
			urlParams: { id },
		});
	}
}
