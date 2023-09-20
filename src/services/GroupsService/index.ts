import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IGroup } from '../../models/groups';

/**
 * Groups service
 */
@injectable()
export class GroupsService {
	private namespace = '/groups/v1/groups';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get stages list
	 * @param id group id
	 * @returns Group entity
	 */
	getGroup(id: string) {
		return this.httpClient.client.get<IGroup>(`${this.namespace}/:id/`, { urlParams: { id } });
	}
}
