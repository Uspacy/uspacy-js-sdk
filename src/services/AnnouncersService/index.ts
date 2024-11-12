import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { generateUrlForAdminApi } from '../../helpers/adminApi';
import { ResponseApi } from './dto/announcers-dto';

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
	async getAnnouncers(populateParams: string[], locale: string, apiPoint: string) {
		const populate = generateUrlForAdminApi({
			apiPoint: this.namespace,
			locale,
			populateParams: populateParams,
		});
		return this.httpClient.client.get<ResponseApi>(populate, {
			baseURL: apiPoint,
			params: {
				populate: 'body,meta',
				locale,
			},
			useAuth: false,
		});
	}
}
