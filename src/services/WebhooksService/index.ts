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
	private namespaceIncoming = '/company/v1/incoming_webhooks';

	private getNamespace(prefix?: boolean): string {
		return prefix ? this.namespaceIncoming : this.namespace;
	}

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get webhooks list
	 * @returns Array webhooks entity
	 */
	getWebhooks(page: number, list?: number, isIncoming?: boolean) {
		return this.httpClient.client.get<IWebhooksResponse>(this.getNamespace(isIncoming), {
			params: {
				page,
				list,
			},
		});
	}

	/**
	 * Create webhook
	 */
	createWebhook(body: IWebhookRequest, isIncoming?: boolean) {
		return this.httpClient.client.post<number>(this.getNamespace(isIncoming), body);
	}

	/**
	 * Delete webhook
	 * @param id webhook id
	 */
	deleteWebhook(id: number, isIncoming?: boolean) {
		return this.httpClient.client.delete<number>(`${this.getNamespace(isIncoming)}/:id/`, { urlParams: { id } });
	}

	/**
	 * Get webhook object
	 * @param id webhook id
	 * @returns Webhook object
	 */
	getWebhookById(id: number, isIncoming?: boolean) {
		return this.httpClient.client.get<IWebhook>(`${this.getNamespace(isIncoming)}/:id/`, { urlParams: { id } });
	}

	/**
	 * Toggle webhook
	 * @param id webhook id
	 */
	toggleWebhook(id: number, isIncoming?: boolean) {
		return this.httpClient.client.patch(`${this.getNamespace(isIncoming)}/:id/toggle`, undefined, { urlParams: { id } });
	}

	/**
	 * Repeat webhook
	 * @param id webhook id
	 */
	repeatWebhook(id: number, isIncoming?: boolean) {
		return this.httpClient.client.patch(`${this.getNamespace(isIncoming)}/:id/repeat`, undefined, { urlParams: { id } });
	}

	/**
	 * Delete webhooks
	 * @param ids ids array
	 */
	deleteSelectedWebhooks(ids: number[], isIncoming?: boolean) {
		return this.httpClient.client.delete<number[]>(this.getNamespace(isIncoming), { data: { ids } });
	}
}
