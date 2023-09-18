import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IFunnel } from '../../models/crm-deals-funnel';

/**
 * CrmDealsFunnel service
 */
@injectable()
export class CrmDealsFunnelsService {
	private namespace = '/crm/v1/entities';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get deals funnels list
	 * @returns Array with deals funnels
	 */
	getDealsFunnels() {
		return this.httpClient.client.get<IFunnel>(`${this.namespace}/deals/funnel`);
	}
}
