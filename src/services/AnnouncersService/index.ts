import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { ResponseApi, ResponseApiList } from './dto/announcers-dto';

/**
 * Announcers
 */
@injectable()
export class AnnouncersService {
	private namespace = '/announce';
	private listNamespace = '/announces';
	constructor(private readonly httpClient: HttpClient) {}

	/**
	 * Get announcers
	 * @deprecated serves only the latest announce without targeting, use getAnnounces
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

	/**
	 * Get all published announces, the newest first
	 * @param domain the current portal, e.g. acme.uspacy.ua: announces aimed only at other portals are left out
	 */
	async getAnnounces(populate: string[], locale: string | undefined, apiPoint: string, domain?: string) {
		return this.httpClient.client.get<ResponseApiList>(this.listNamespace, {
			baseURL: apiPoint,
			params: {
				populate,
				locale,
				domain,
				sort: 'publishedAt:desc',
				pagination: { pageSize: 100 },
			},
			useAuth: false,
		});
	}
}
