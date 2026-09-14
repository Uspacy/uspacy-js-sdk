import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IApp } from '../../models/app';
import { IAutomation } from '../../models/automations';
import { IContributorsLookupRequest, IContributorsLookupResponse } from '../../models/contributors';
import {
	IExecutionActionResult,
	IExecutionDetail,
	IExecutionDetailRequest,
	IExecutionHistoryRequest,
	IExecutionHistoryResponse,
	IExecutionNodeDetail,
	IExecutionNodeRequest,
	IExecutionsCancelRequest,
} from '../../models/execution-history';
import { IResponseWithMeta } from '../../models/response';
import { IWorkflow, IWorkflowsResponse } from '../../models/workflows';

/**
 * Automations service
 */
@injectable()
export class AutomationsService {
	private namespace = '/automations-backend/v1/';
	private namespace_workers = '/automations-backend/v1/workers';
	private namespace_workflows = '/automations-backend/v1/processes';
	private namespace_history = '/automations-backend/v1/history/:type';
	constructor(private readonly httpClient: HttpClient) {}

	/**
	 * Get execution history list of workers or processes
	 * @param type workers or processes
	 * @param params pagination, filters and sorting
	 * @param signal AbortSignal for cancelling request
	 */
	getExecutionHistory({ type, params, signal }: IExecutionHistoryRequest) {
		return this.httpClient.client.get<IExecutionHistoryResponse>(this.namespace_history, { params, signal, urlParams: { type } });
	}

	/**
	 * Get execution detail
	 * @param type workers or processes
	 * @param executionId execution id
	 * @param signal AbortSignal for cancelling request
	 */
	getExecution({ type, executionId, signal }: IExecutionDetailRequest) {
		return this.httpClient.client.get<{ data: IExecutionDetail }>(`${this.namespace_history}/:executionId`, {
			signal,
			urlParams: { type, executionId },
		});
	}

	/**
	 * Get execution node detail
	 * @param type workers or processes
	 * @param executionId execution id
	 * @param nodeId execution node id
	 * @param signal AbortSignal for cancelling request
	 */
	getExecutionNode({ type, executionId, nodeId, signal }: IExecutionNodeRequest) {
		return this.httpClient.client.get<{ data: IExecutionNodeDetail }>(`${this.namespace_history}/:executionId/nodes/:nodeId`, {
			signal,
			urlParams: { type, executionId, nodeId },
		});
	}

	/**
	 * Retry failed execution node
	 * @param type workers or processes
	 * @param executionId execution id
	 * @param nodeId execution node id
	 */
	retryExecutionNode({ type, executionId, nodeId }: IExecutionNodeRequest) {
		return this.httpClient.client.post<{ data: IExecutionActionResult }>(
			`${this.namespace_history}/:executionId/nodes/:nodeId/retry`,
			undefined,
			{ urlParams: { type, executionId, nodeId } },
		);
	}

	/**
	 * Skip execution pause
	 * @param type workers or processes
	 * @param executionId execution id
	 * @param nodeId pause node id
	 */
	skipExecutionPause({ type, executionId, nodeId }: IExecutionNodeRequest) {
		return this.httpClient.client.patch<{ data: IExecutionActionResult }>(
			`${this.namespace_history}/:executionId/nodes/:nodeId/skip-pause`,
			undefined,
			{ urlParams: { type, executionId, nodeId } },
		);
	}

	/**
	 * Cancel pending executions of an automation or process, or the given executions
	 * @param type workers or processes
	 * @param id automation or process id
	 * @param executionIds execution ids
	 */
	cancelExecutions({ type, id, executionIds }: IExecutionsCancelRequest) {
		return this.httpClient.client.patch<{ data: IExecutionActionResult }>(
			`${this.namespace_history}/cancel`,
			executionIds?.length ? { execution_ids: executionIds } : { id },
			{ urlParams: { type } },
		);
	}

	/**
	 * Get automations list
	 * @param page page number
	 * @param list page count
	 * @param search search query
	 * @param sortBy field to sort by
	 * @param sortOrder sort direction
	 */
	async getAutomations(page?: number, list?: number, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc') {
		return this.httpClient.client.get<IResponseWithMeta<IApp[]>>(this.namespace_workers, {
			params: {
				page,
				list,
				search,
				sort_by: sortBy,
				sort_order: sortOrder,
			},
		});
	}

	/**
	 * Delete automation
	 * @param id automation id
	 */
	deleteAutomation(id: number) {
		return this.httpClient.client.delete<number>(`${this.namespace_workers}/:id`, { urlParams: { id } });
	}

	/**
	 * Toggle automation
	 * @param id automation id
	 * @param body request body
	 */
	toggleAutomation(id: number, body: IAutomation) {
		return this.httpClient.client.patch(`${this.namespace_workers}/:id`, body, { urlParams: { id } });
	}

	/**
	 * Get titles of processes and workers by their ids
	 * @param body ids grouped by contributor type
	 */
	lookupContributors(body: IContributorsLookupRequest) {
		return this.httpClient.client.post<IContributorsLookupResponse>(`${this.namespace}lookup`, body);
	}

	/**
	 * Get processes list
	 * @param page page number
	 * @param list page count
	 * @param search search query
	 * @param sortBy field to sort by
	 * @param sortOrder sort direction
	 */
	async getWorkflows(page?: number, list?: number, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc') {
		return this.httpClient.client.get<IWorkflowsResponse>(this.namespace_workflows, {
			params: {
				page,
				list,
				search,
				sort_by: sortBy,
				sort_order: sortOrder,
			},
		});
	}

	/**
	 * Create workflow
	 * @param data workflow data
	 */
	createWorkflow(data: Partial<IWorkflow>) {
		return this.httpClient.client.post<IWorkflow>(this.namespace_workflows, data);
	}

	/**
	 * Update workflow
	 * @param data workflow data
	 */
	updateWorkflow(data: Partial<IWorkflow>) {
		return this.httpClient.client.patch<IWorkflow>(`${this.namespace_workflows}/:id`, data, { urlParams: { id: data?.id } });
	}

	/**
	 * Delete workflow
	 * @param id workflow id
	 */
	deleteWorkflow(id: number) {
		return this.httpClient.client.delete<number>(`${this.namespace_workflows}/:id`, { urlParams: { id } });
	}

	/**
	 * Toggle workflow
	 * @param id workflow id
	 * @param body request body
	 */
	toggleWorkflow(id: number, body: IAutomation) {
		return this.httpClient.client.patch(`${this.namespace_workflows}/:id`, body, { urlParams: { id } });
	}
}
