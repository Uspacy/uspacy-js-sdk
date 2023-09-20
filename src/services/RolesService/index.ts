import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IRole } from '../../models/roles';

/**
 * Roles service
 */
@injectable()
export class RolesService {
	private namespace = '/company/v1/roles';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get roles
	 * @returns list of roles
	 */
	getRoles() {
		return this.httpClient.client.get<IRole[]>(this.namespace);
	}
}
