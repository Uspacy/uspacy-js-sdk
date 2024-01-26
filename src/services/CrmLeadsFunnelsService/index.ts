import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IFunnel } from '../../models/crm-funnel';
import { IReason, IReasonsCreate, IStage } from '../../models/crm-stages';

/**
 * CrmLeadsFunnel service
 */
@injectable()
export class CrmLeadsFunnelsService {
	private namespace = '/crm/v1/entities/leads';
	private reasonsNamespace = '/crm/v1/reasons';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get leads funnels list
	 * @returns Array with leads funnels
	 */
	getLeadsFunnels() {
		return this.httpClient.client.get<IFunnel[]>(`${this.namespace}/funnel`);
	}

	/**
	 * Create leads funnel
	 * @param data leads funnel data without id
	 * @returns leads funnel entity
	 */
	createLeadsFunnel(data: Partial<IFunnel>) {
		return this.httpClient.client.post<IFunnel>(`${this.namespace}/funnel`, data);
	}

	/**
	 * Update leads funnel
	 * @param id leads funnel id
	 * @param data leads funnel data
	 * @returns leads funnel entity
	 */
	updateLeadsFunnel(id: number, data: Partial<IFunnel>) {
		return this.httpClient.client.patch<IFunnel>(`${this.namespace}/funnel/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Delete leads funnel
	 * @param id leads funnel id
	 */
	deleteLeadsFunnel(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/funnel/:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Create stage for leads funnel
	 * @param data stage data without id
	 */
	createStageForLeadsFunnel(data: Partial<IStage>) {
		return this.httpClient.client.post<IStage>(`${this.namespace}/kanban/stage`, data);
	}

	/**
	 * Update stage for leads funnel
	 * @param id stage id
	 * @param data stage data
	 */
	updateStageForLeadsFunnel(id: number, data: Partial<IStage>) {
		return this.httpClient.client.patch<IStage>(`${this.namespace}/kanban/stage/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Delete stage for leads funnel
	 * @param id stage id
	 */
	deleteStageForLeadsFunnel(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/kanban/stage/:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Create reasons for leads funnel stage
	 * @param reason reason data without id
	 * @returns reason entity
	 * */
	createReasonsForLeadsFunnelStage(reason: Partial<IReasonsCreate>) {
		return this.httpClient.client.post<IReason>(`${this.reasonsNamespace}/:funnelId`, reason, {
			urlParams: { funnelId: reason.funnelId },
		});
	}

	/**
	 * Update reasons for leads funnel stage
	 * @param funnelId funnels id
	 * @param reason reason data
	 * @returns reason entity
	 */
	updateReasonsForLeadsFunnelStage(funnelId: number, reason: Partial<IReason>) {
		return this.httpClient.client.patch<IReason>(`${this.reasonsNamespace}/:funnelId`, reason, {
			urlParams: { funnelId },
		});
	}

	/**
	 * Delete reasons for leads funnel stage
	 * @param funnelId funnels id
	 */
	deleteReasonsForLeadsFunnelStage(funnelId: number) {
		return this.httpClient.client.delete(`${this.reasonsNamespace}/:funnelId`, {
			urlParams: { funnelId },
		});
	}
}
