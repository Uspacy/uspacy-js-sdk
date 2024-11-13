import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
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
	async getAnnouncers(populate: string[], locale: string, apiPoint: string) {
		return this.httpClient.client.get<ResponseApi>(this.namespace, {
			baseURL: apiPoint,
			params: {
				populate,
				locale,
			},
			useAuth: false,
		});
	}
}
