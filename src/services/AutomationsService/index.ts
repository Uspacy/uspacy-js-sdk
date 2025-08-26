import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IApp } from '../../models/app';
import { IAutomation } from '../../models/automations';
import { IResponseWithMeta } from '../../models/response';
import { IWorkflowsResponse } from '../../models/workflows';

/**
 * Automations service
 */
@injectable()
export class AutomationsService {
	private namespace = '/automations-backend/v1/';
	private namespace_workers = '/automations-backend/v1/workers';
	private namespace_workflows = '/automations-backend/v1/processes';
	constructor(private readonly httpClient: HttpClient) {}

	/**
	 * Get automations list
	 * @param page page number
	 * @param list page count
	 * @param search search query
	 */
	async getAutomations(page?: number, list?: number, search?: string) {
		return this.httpClient.client.get<IResponseWithMeta<IApp[]>>(this.namespace_workers, {
			params: {
				page,
				list,
				search,
			},
		});
	}

	/**
	 * Delete automation
	 * @param id automation id
	 */
	deleteAutomation(id: number) {
		return this.httpClient.client.delete<number>(`${this.namespace_workers}:id`, { urlParams: { id } });
	}

	/**
	 * Toggle automation
	 * @param id automation id
	 * @param body request body
	 */
	toggleAutomation(id: number, body: IAutomation) {
		return this.httpClient.client.patch(`${this.namespace_workers}:id`, body, { urlParams: { id } });
	}

	/**
	 * Get processes list
	 * @param page page number
	 * @param list page count
	 * @param search search query
	 */
	async getWorkflows(page?: number, list?: number, search?: string) {
		return this.httpClient.client.get<IWorkflowsResponse>(this.namespace_workflows, {
			params: {
				page,
				list,
				search,
			},
		});
	}

	/**
	 * Delete workflow
	 * @param id workflow id
	 */
	deleteWorkflow(id: number) {
		return this.httpClient.client.delete<number>(`${this.namespace_workflows}:id`, { urlParams: { id } });
	}

	/**
	 * Toggle workflow
	 * @param id workflow id
	 * @param body request body
	 */
	toggleWorkflow(id: number, body: IAutomation) {
		return this.httpClient.client.patch(`${this.namespace_workflows}:id`, body, { urlParams: { id } });
	}
}
