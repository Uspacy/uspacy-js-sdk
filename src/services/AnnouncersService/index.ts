import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { generateUrlForAdminApi } from '../../helpers/adminApi';
import { IApp } from '../../models/app';
import { IResponseWithMeta } from '../../models/response';

/**
 * Announcers service
 */
@injectable()
export class AppsService {
	private namespace = '/announce';
	constructor(private readonly httpClient: HttpClient) {}

	/**
	 * Get announcers
	 */
	async getAnnpincers(populateParams: string[], locale: string) {
		const populate = generateUrlForAdminApi({
			apiPoint: this.namespace,
			locale,
			populateParams: populateParams,
		});
		return this.httpClient.client.get<IResponseWithMeta<IApp[]>>(populate, {
			params: {
				populate: 'body,meta',
				locale,
			},
		});
	}
}
