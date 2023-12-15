import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IFunnel } from '../../models/crm-deals-funnel';

/**
 * CrmLeadsFunnel service
 */
@injectable()
export class CrmLeadsFunnelsService {
	private namespace = '/crm/v1/entities';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get leads funnels list
	 * @returns Array with leads funnels
	 */
	getLeadsFunnels() {
		return this.httpClient.client.get<IFunnel>(`${this.namespace}/leads/funnel`);
	}
}
