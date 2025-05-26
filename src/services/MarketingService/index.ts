import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IEmailTemplate } from '../../models/email-template';
import { IEmailTemplateFilter } from '../../models/email-template-filter';
import { IResponseWithMeta } from '../../models/response';

/**
 * Marketing service
 */

@injectable()
export class MarketingService {
	private namespace = '/marketing/v1/templates';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get email templates list with filters
	 * @param params email templates list filter params
	 * @param signal abort signal
	 * @returns Array email templates entity
	 */
	getEmailTemplates(params: Partial<IEmailTemplateFilter>, signal?: AbortSignal) {
		return this.httpClient.client.get<IResponseWithMeta<IEmailTemplate>>(`${this.namespace}/letters`, { params, signal });
	}

	/**
	 * Get email template by id
	 * @param id email template id
	 * @returns Email template entity
	 */
	getEmailTemplate(id: number) {
		return this.httpClient.client.get<IEmailTemplate>(`${this.namespace}/letters/${id}`);
	}

	/**
	 * Create email template
	 * @param data email template payload
	 * @returns Email template entity
	 */
	createEmailTemplate(data: Partial<IEmailTemplate>) {
		return this.httpClient.client.post<IEmailTemplate>(`${this.namespace}/letters`, data);
	}

	/**
	 * Update email template
	 * @param id email template id
	 * @param data email template payload
	 * @returns Email template entity
	 */
	updateEmailTemplate(id: number, data: Partial<IEmailTemplate>) {
		return this.httpClient.client.patch<IEmailTemplate>(`${this.namespace}/letters/${id}`, data);
	}

	/**
	 * Delete email template
	 * @param id email template id
	 */
	deleteEmailTemplate(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/letters/${id}`);
	}

	/**
	 * Mass editing email templates
	 * @param id email template ids array
	 * @param payload email template payload
	 * @param all all email templates flag
	 * @param params email templates list filter params
	 */
	massEditingEmailTemplates(id: number[], payload: Partial<IEmailTemplate>, all: boolean, params: Partial<IEmailTemplateFilter>) {
		return this.httpClient.client.post(`${this.namespace}/letters/mass_edit`, { all, payload, ...(id && id), ...(params && params) });
	}

	/**
	 * Mass deletion email templates
	 * @param id email template ids array
	 * @param all all email templates flag
	 * @param params email templates list filter params
	 */
	massDeletionEmailTemplates(id: number[], all: boolean, params: Partial<IEmailTemplateFilter>) {
		return this.httpClient.client.delete(`${this.namespace}/letters/mass_deletion`, { data: { all, ...(id && id), ...(params && params) } });
	}
}
