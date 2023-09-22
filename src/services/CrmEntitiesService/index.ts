import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IEntityMain } from '../../models/crm-entities';

/**
 * CrmEntities service
 */
@injectable()
export class CrmEntitiesService {
	private namespace = '/crm/v1/entity';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get crm entities list
	 * @returns Array crm entities list
	 */
	getEntities() {
		return this.httpClient.client.get<IEntityMain>(this.namespace);
	}
}
