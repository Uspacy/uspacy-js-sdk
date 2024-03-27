import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IReason, IReasons, IReasonsCreate, IStage, IStages } from '../../models/crm-stages';

/**
 * CrmLeadsFunnel service
 */
@injectable()
export class CrmLeadsStagesService {
	private namespace = '/crm/v1/entities/leads';
	private reasonsNamespace = '/crm/v1/reasons';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get leads stages list
	 * @returns Array with leads stages
	 */
	getLeadsStages() {
		return this.httpClient.client.get<IStages>(`${this.namespace}/kanban/stage`);
	}

	/**
	 * Create stage for leads funnel
	 * @param data stage data without id
	 */
	createLeadsStage(data: Partial<IStage>) {
		return this.httpClient.client.post<IStage>(`${this.namespace}/kanban/stage`, data);
	}

	/**
	 * Update stage for leads funnel
	 * @param id stage id
	 * @param data stage data
	 */
	updateLeadsStage(id: number, data: Partial<IStage>) {
		return this.httpClient.client.patch<IStage>(`${this.namespace}/kanban/stage/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Delete stage for leads funnel
	 * @param id stage id
	 */
	deleteLeadsStage(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/kanban/stage/:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Get leads reasons list
	 * @param leadsId id of leads entity
	 * @returns Array with leads reasons
	 */
	getLeadsReasons(leadsId: number) {
		return this.httpClient.client.get<IReasons>(`${this.reasonsNamespace}/:leadsId`, {
			urlParams: { leadsId },
		});
	}

	/**
	 * Create reason for leads
	 * @param leadsId id of leads entity
	 * @param data reason data without id
	 * @returns reason entity
	 */
	createLeadsStageReasons(leadsId: number, data: Partial<IReasonsCreate>) {
		return this.httpClient.client.post<IReason>(`${this.reasonsNamespace}/:leadsId`, data, {
			urlParams: { leadsId },
		});
	}

	/**
	 * Update reason for leads
	 * @param data reason data
	 * @returns reason entity
	 */
	updateLeadsReason(id: number, data: Partial<IReason>) {
		return this.httpClient.client.patch<IReason>(`${this.reasonsNamespace}/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Delete reason for leads
	 * @param id reason id
	 */
	deleteLeadsReason(id: number) {
		return this.httpClient.client.delete(`${this.reasonsNamespace}/:id`, {
			urlParams: { id },
		});
	}
}
