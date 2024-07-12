import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IReason, IReasons, IReasonsCreate, IStage, IStages } from '../../models/crm-stages';

/**
 * CrmDealsFunnel service
 */
@injectable()
export class CrmDealsStagesService {
	private namespace = '/crm/v1/entities/deals';
	private reasonsNamespace = '/crm/v1/reasons';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get deals stages list
	 * @returns Array with deals stages
	 */
	getDealsStages() {
		return this.httpClient.client.get<IStages>(`${this.namespace}/kanban/stage`);
	}

	/**
	 * Create stage for deals funnel
	 * @param data stage data without id
	 */
	createDealsStage(data: Partial<IStage>) {
		return this.httpClient.client.post<IStage>(`${this.namespace}/kanban/stage`, data);
	}

	/**
	 * Update stage for deals funnel
	 * @param id stage id
	 * @param data stage data
	 */
	updateDealsStage(id: number, data: Partial<IStage>) {
		return this.httpClient.client.patch<IStage>(`${this.namespace}/kanban/stage/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Delete stage for deals funnel
	 * @param id stage id
	 */
	deleteDealsStage(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/kanban/stage/:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Get deals reasons list
	 * @param dealsId id of deals entity
	 * @returns Array with deals reasons
	 */
	getDealsReasons(dealsId: number) {
		return this.httpClient.client.get<IReasons>(`${this.reasonsNamespace}/:dealsId`, {
			urlParams: { dealsId },
		});
	}

	/**
	 * Create reason for deals
	 * @param dealsId id of deals entity
	 * @param data reason data without id
	 * @returns reason entity
	 */
	createDealsStageReasons(dealsId: number, data: Partial<IReasonsCreate>) {
		return this.httpClient.client.post<IReason>(`${this.reasonsNamespace}/:dealsId`, data, {
			urlParams: { dealsId },
		});
	}

	/**
	 * Update reason for deals
	 * @param data reason data
	 * @returns reason entity
	 */
	updateDealsReason(id: number, data: Partial<IReason>) {
		return this.httpClient.client.patch<IReason>(`${this.reasonsNamespace}/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Delete reason for deals
	 * @param id reason id
	 */
	deleteDealsReason(id: number) {
		return this.httpClient.client.delete(`${this.reasonsNamespace}/:id`, {
			urlParams: { id },
		});
	}
}
