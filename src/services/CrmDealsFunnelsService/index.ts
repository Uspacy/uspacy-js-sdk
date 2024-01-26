import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IFunnel } from '../../models/crm-funnel';
import { IReason, IReasonsCreate, IStage, IStages } from '../../models/crm-stages';

/**
 * CrmDealsFunnel service
 */
@injectable()
export class CrmDealsFunnelsService {
	private namespace = '/crm/v1/entities/deals';
	private reasonsNamespace = '/crm/v1/reasons';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get deals funnels list
	 * @returns Array with deals funnels
	 */
	getDealsFunnels() {
		return this.httpClient.client.get<IFunnel[]>(`${this.namespace}/funnel`);
	}

	/**
	 * Create deals funnel
	 * @param data deals funnel data without id
	 * @returns deals funnel entity
	 */
	createDealsFunnel(data: Partial<IFunnel>) {
		return this.httpClient.client.post<IFunnel>(`${this.namespace}/funnel`, data);
	}

	/**
	 * Update deals funnel
	 * @param id deals funnel id
	 * @param data deals funnel data
	 * @returns deals funnel entity
	 */
	updateDealsFunnel(id: number, data: Partial<IFunnel>) {
		return this.httpClient.client.patch<IFunnel>(`${this.namespace}/funnel/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Delete deals funnel
	 * @param id deals funnel id
	 */
	deleteDealsFunnel(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/funnel/:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Create stage for deals funnel
	 * @param data stage data without id
	 */
	createStageForDealsFunnel(data: Partial<IStage>) {
		return this.httpClient.client.post<IStage>(`${this.namespace}/kanban/stage`, data);
	}

	/**
	 * Update stage for deals funnel
	 * @param id stage id
	 * @param data stage data
	 */
	updateStageForDealsFunnel(id: number, data: Partial<IStage>) {
		return this.httpClient.client.patch<IStage>(`${this.namespace}/kanban/stage/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Delete stage for deals funnel
	 * @param id stage id
	 */
	deleteStageForDealsFunnel(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/kanban/stage/:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Create reasons for deals funnel stage
	 * @param reason reason data without id
	 * @returns reason entity
	 * */
	createReasonsForDealsFunnelStage(reason: Partial<IReasonsCreate>) {
		return this.httpClient.client.post<IReason>(`${this.reasonsNamespace}/:funnelId`, reason, {
			urlParams: { funnelId: reason.funnelId },
		});
	}

	/**
	 * Update reasons for deals funnel stage
	 * @param funnelId funnels id
	 * @param reason reason data
	 * @returns reason entity
	 */
	updateReasonsForDealsFunnelStage(funnelId: number, reason: Partial<IReason>) {
		return this.httpClient.client.patch<IReason>(`${this.reasonsNamespace}/:funnelId`, reason, {
			urlParams: { funnelId },
		});
	}

	/**
	 * Delete reasons for deals funnel stage
	 * @param funnelId funnels id
	 */
	deleteReasonsForDealsFunnelStage(funnelId: number) {
		return this.httpClient.client.delete(`${this.reasonsNamespace}/:funnelId`, {
			urlParams: { funnelId },
		});
	}

	/**
	 * Get reasons for deals funnel stage
	 * @param funnelId funnels id
	 * @returns Array with reasons
	 */
	getStagesForDealsFunnel(funnelId: number) {
		return this.httpClient.client.get<IStages>(`${this.namespace}/kanban/stage`, {
			params: {
				funnel_id: funnelId,
			},
		});
	}
}
