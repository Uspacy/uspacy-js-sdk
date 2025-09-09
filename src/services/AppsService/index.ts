import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IApp, IAppsFilter } from '../../models/app';
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
	 * @param page page number
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

	/**
	 * Get apps
	 * @param filters filter params by IAppsFilter
	 * @param lang language
	 */
	async getAppsWithFilters(filters: IAppsFilter, lang: string) {
		return this.httpClient.client.get<IResponseWithMeta<IApp[]>>(this.namespace, {
			params: filters,
			headers: {
				'Accept-Language': lang,
			},
		});
	}

	/**
	 * Get app by id
	 * @param id app id
	 */
	async getApp(id: number, lang: string) {
		return this.httpClient.client.get<IResponseWithMeta<IApp[]>>(`${this.namespace}/:id/`, {
			urlParams: { id },
			headers: {
				'Accept-Language': lang,
			},
		});
	}
}
