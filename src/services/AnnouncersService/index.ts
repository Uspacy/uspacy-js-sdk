import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { generateUrlForAdminApi } from '../../helpers/adminApi';
import { IAnnouncers } from './dto/announcers-dto';

/**
 * Announcers
 */
@injectable()
export class AnnouncersService {
	private namespace = '/announce';
	constructor(private readonly httpClient: HttpClient) {}

	/**
	 * Get announcers
	 */
	async getAnnouncers(populateParams: string[], locale: string) {
		const populate = generateUrlForAdminApi({
			apiPoint: this.namespace,
			locale,
			populateParams: populateParams,
		});
		return this.httpClient.client.get<IAnnouncers>(populate, {
			params: {
				populate: 'body,meta',
				locale,
			},
		});
	}
}
