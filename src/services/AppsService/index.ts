import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IApp } from '../../models/app';
import { IResponseWithMeta } from '../../models/response';

/**
 * Apps service
 */
@injectable()
export class AppsService {
	private namespace = '/apps/v1/apps';
	constructor(private readonly httpClient: HttpClient) {}

	/**
	 * Get apps
	 * @param page
	 * @param list
	 */
	async getApps(page: number, lang: string, list?: number) {
		return this.httpClient.client.get<IResponseWithMeta<IApp[]>>(this.namespace, {
			params: {
				page,
				list,
			},
			headers: {
				'Accept-Language': lang,
			},
		});
	}
}
