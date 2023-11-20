import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IWebhook, IWebhooksResponse } from '../../models/webhooks';
import { IWebhookRequest } from './dto/create-webhook.dto';

/**
 * Webhooks service
 */
@injectable()
export class WebhooksService {
	private namespace = '/company/v1/webhooks';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get webhooks list
	 * @returns Array webhooks entity
	 */
	getWebhooks(page: number, list?: number) {
		return this.httpClient.client.get<IWebhooksResponse>(this.namespace, {
			params: {
				page,
				list,
			},
		});
	}

	/**
	 * Create webhook
	 */
	createWebhook(body: IWebhookRequest) {
		return this.httpClient.client.post<number>(this.namespace, body);
	}

	/**
	 * Delete webhook
	 * @param id webhook id
	 */
	deleteWebhook(id: number) {
		return this.httpClient.client.delete<number>(`${this.namespace}/:id/`, { urlParams: { id } });
	}

	/**
	 * Get webhook object
	 * @param id webhook id
	 * @returns Webhook object
	 */
	getWebhookById(id: number) {
		return this.httpClient.client.get<IWebhook>(`${this.namespace}/:id/`, { urlParams: { id } });
	}

	/**
	 * Toggle webhook
	 * @param id webhook id
	 */
	toggleWebhook(id: number) {
		return this.httpClient.client.patch(`${this.namespace}/:id/toggle`, undefined, { urlParams: { id } });
	}

	/**
	 * Repeat webhook
	 * @param id webhook id
	 */
	repeatWebhook(id: number) {
		return this.httpClient.client.patch(`${this.namespace}/:id/repeat`, undefined, { urlParams: { id } });
	}

	/**
	 * Delete webhooks
	 * @param ids ids array
	 */
	deleteSelectedWebhooks(ids: number[]) {
		return this.httpClient.client.delete<number[]>(this.namespace, { data: { ids: ids } });
	}
}
