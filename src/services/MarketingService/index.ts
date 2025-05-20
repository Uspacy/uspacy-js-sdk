import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IEmailTemplate } from '../../models/email-template';
import { ITemplateFilter } from '../../models/email-template-filter';
import { IResponseWithMeta } from '../../models/response';

/**
 * Marketing service
 */

@injectable()
export class MarketingService {
	private namespace = '/marketing/v1/templates';

	constructor(private httpClient: HttpClient) {}

	getEmailTemplates(params: ITemplateFilter, signal?: AbortSignal) {
		return this.httpClient.client.get<IResponseWithMeta<IEmailTemplate>>(`${this.namespace}/letters`, { params, signal });
	}

	getEmailTemplate(id: number) {
		return this.httpClient.client.get<IEmailTemplate>(`${this.namespace}/letters/${id}`);
	}

	createEmailTemplate(data: Partial<IEmailTemplate>) {
		return this.httpClient.client.post<IEmailTemplate>(`${this.namespace}/letters`, data);
	}

	updateEmailTemplate(id: number, data: Partial<IEmailTemplate>) {
		return this.httpClient.client.patch<IEmailTemplate>(`${this.namespace}/letters/${id}`, data);
	}

	deleteEmailTemplate(id: number) {
		return this.httpClient.client.delete<IEmailTemplate>(`${this.namespace}/letters/${id}`);
	}
}
