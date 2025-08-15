import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IEmailNewsletter, INewsletterRecipients } from '../../models/email-newsletter';
import { IEmailTemplate } from '../../models/email-template';
import { IMarketingFilter, INewsletterRecipientsFilter } from '../../models/marketing-filter';
import { IDomain } from '../../models/newsletters-domain';
import { ISender } from '../../models/newsletters-sender';
import { IResponseWithMeta } from '../../models/response';

/**
 * Marketing service
 */

@injectable()
export class MarketingService {
	private namespaceTemplates = '/marketing/v1/templates';
	private namespaceNewsletters = '/marketing/v1/newsletters';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get email templates list with filters
	 * @param params email templates list filter params
	 * @param signal abort signal
	 * @returns Array email templates entity
	 */
	getEmailTemplates(params: Partial<IMarketingFilter>, signal?: AbortSignal) {
		return this.httpClient.client.get<IResponseWithMeta<IEmailTemplate>>(`${this.namespaceTemplates}/letters`, { params, signal });
	}

	/**
	 * Get email template by id
	 * @param id email template id
	 * @returns Email template entity
	 */
	getEmailTemplate(id: number) {
		return this.httpClient.client.get<IEmailTemplate>(`${this.namespaceTemplates}/letters/${id}`);
	}

	/**
	 * Create email template
	 * @param data email template payload
	 * @returns Email template entity
	 */
	createEmailTemplate(data: Partial<IEmailTemplate>) {
		return this.httpClient.client.post<IEmailTemplate>(`${this.namespaceTemplates}/letters`, data);
	}

	/**
	 * Update email template
	 * @param id email template id
	 * @param data email template payload
	 * @returns Email template entity
	 */
	updateEmailTemplate(id: number, data: Partial<IEmailTemplate>) {
		return this.httpClient.client.patch<IEmailTemplate>(`${this.namespaceTemplates}/letters/${id}`, data);
	}

	/**
	 * Delete email template
	 * @param id email template id
	 */
	deleteEmailTemplate(id: number) {
		return this.httpClient.client.delete(`${this.namespaceTemplates}/letters/${id}`);
	}

	/**
	 * Mass editing email templates
	 * @param id email template ids array
	 * @param payload email template payload
	 * @param all all email templates flag
	 * @param params email templates list filter params
	 */
	massEditingEmailTemplates(id: number[], payload: Partial<IEmailTemplate>, all: boolean, params: Partial<IMarketingFilter>) {
		return this.httpClient.client.post(`${this.namespaceTemplates}/letters/mass_edit`, {
			all,
			payload,
			...(id && { id }),
			...(params && params),
		});
	}

	/**
	 * Mass deletion email templates
	 * @param id email template ids array
	 * @param all all email templates flag
	 * @param params email templates list filter params
	 */
	massDeletionEmailTemplates(id: number[], all: boolean, params: Partial<IMarketingFilter>) {
		return this.httpClient.client.delete(`${this.namespaceTemplates}/letters/mass_deletion`, {
			data: { all, ...(id && { id }), ...(params && params) },
		});
	}

	/**
	 * Get email newsletters list with filters
	 * @param params email newsletters list filter params
	 * @param signal abort signal
	 * @returns Array email newsletters entity
	 */
	getEmailNewsletters(params: Partial<IMarketingFilter>, signal?: AbortSignal) {
		return this.httpClient.client.get<IResponseWithMeta<IEmailNewsletter>>(`${this.namespaceNewsletters}/mailings`, { params, signal });
	}

	/**
	 * Get email newsletter by id
	 * @param id email newsletter id
	 * @returns Email newsletter entity
	 */
	getEmailNewsletter(id: number) {
		return this.httpClient.client.get<IEmailNewsletter>(`${this.namespaceNewsletters}/mailings/${id}`);
	}

	/**
	 * Get email newsletter by id with statistics
	 * @param id email newsletter id
	 * @returns Email newsletter entity with statistics
	 */
	getEmailNewsletterStatistics(id: number) {
		return this.httpClient.client.get<IEmailNewsletter>(`${this.namespaceNewsletters}/mailings/${id}/statistics`);
	}

	/**
	 * Get email newsletter recipients
	 * @param id email newsletter id
	 * @param params email newsletter recipients filter params
	 * @returns Array email newsletter recipients entity
	 */
	getEmailNewsletterRecipients(id: number, params: Partial<INewsletterRecipientsFilter>) {
		return this.httpClient.client.get<IResponseWithMeta<INewsletterRecipients>>(`${this.namespaceNewsletters}/mailings/${id}/recipients`, {
			params,
		});
	}

	/**
	 * Create email newsletter
	 * @param data email newsletter payload
	 * @returns Email newsletter entity
	 */
	createEmailNewsletter(data: Partial<IEmailNewsletter>) {
		return this.httpClient.client.post<IEmailNewsletter>(`${this.namespaceNewsletters}/mailings`, data);
	}

	/**
	 * Update email newsletter
	 * @param id email newsletter id
	 * @param data email newsletter payload
	 * @returns Email newsletter entity
	 */
	updateEmailNewsletter(id: number, data: Partial<IEmailNewsletter>) {
		return this.httpClient.client.patch<IEmailNewsletter>(`${this.namespaceNewsletters}/mailings/${id}`, data);
	}

	/**
	 * Delete email newsletter
	 * @param id email newsletter id
	 */
	deleteEmailNewsletter(id: number) {
		return this.httpClient.client.delete(`${this.namespaceNewsletters}/mailings/${id}`);
	}

	/**
	 * Send email newsletter
	 * @param id email newsletter id
	 */
	sendEmailNewsletter(id: number) {
		return this.httpClient.client.get(`${this.namespaceNewsletters}/mailings/send/${id}`);
	}

	/**
	 * Start email newsletter mailings
	 */
	startEmailNewsletterMailings() {
		return this.httpClient.client.get(`${this.namespaceNewsletters}/mailings/start`);
	}

	/**
	 * Mass send email newsletters
	 * @param id email newsletter ids array
	 * @param params email newsletters list filter params
	 */
	massSendingEmailNewsletters(ids: number[], all: boolean, params: Partial<IMarketingFilter>) {
		return this.httpClient.client.post(`${this.namespaceNewsletters}/mailings/mass_send`, {
			data: { all, ...(ids && { ids }), ...(params && params) },
		});
	}

	/**
	 * Mass deletion email newsletters
	 * @param id email newsletter ids array
	 * @param params email newsletters list filter params
	 */
	massDeletionEmailNewsletters(id: number[], all: boolean, params: Partial<IMarketingFilter>) {
		return this.httpClient.client.delete(`${this.namespaceNewsletters}/mailings/mass_deletion`, {
			data: { all, ...(id && { id }), ...(params && params) },
		});
	}

	/**
	 * Get domains list
	 * @returns Array domains entity
	 */
	getDomains() {
		return this.httpClient.client.get<IDomain[]>(`${this.namespaceNewsletters}/domains`);
	}

	/**
	 * Get domain by id
	 * @param id domain id
	 * @returns Domain entity
	 */
	getDomain(id: number) {
		return this.httpClient.client.get<IDomain>(`${this.namespaceNewsletters}/domains/${id}`);
	}

	/**
	 * Get domain status
	 * @param id domain id
	 * @returns Domain entity
	 */
	getDomainStatus(id: number) {
		return this.httpClient.client.get<IDomain>(`${this.namespaceNewsletters}/domains/status/${id}`);
	}

	/**
	 * Create domain
	 * @param data domain payload
	 * @returns Domain entity
	 */
	createDomain(data: { domain: string }) {
		return this.httpClient.client.post<IDomain>(`${this.namespaceNewsletters}/domains`, data);
	}

	/**
	 * Delete domain
	 * @param id domain id
	 */
	deleteDomain(id: number) {
		return this.httpClient.client.delete(`${this.namespaceNewsletters}/domains/${id}`);
	}

	/**
	 * Get senders list
	 * @returns Array senders entity
	 */
	getSenders() {
		return this.httpClient.client.get<ISender[]>(`${this.namespaceNewsletters}/senders`);
	}

	/**
	 * Get sender by id
	 * @param id sender id
	 * @returns Sender entity
	 */
	getSender(id: number) {
		return this.httpClient.client.get<ISender>(`${this.namespaceNewsletters}/senders/${id}`);
	}

	/**
	 * Create sender
	 * @param data sender payload
	 * @returns Sender entity
	 */
	createSender(data: Partial<ISender>) {
		return this.httpClient.client.post<ISender>(`${this.namespaceNewsletters}/senders`, data);
	}

	/**
	 * Update sender
	 * @param id sender id
	 * @param data sender payload
	 * @returns Sender entity
	 */
	updateSender(id: number, data: Partial<ISender>) {
		return this.httpClient.client.patch<ISender>(`${this.namespaceNewsletters}/senders/${id}`, data);
	}

	/**
	 * Delete sender
	 * @param id sender id
	 */
	deleteSender(id: number) {
		return this.httpClient.client.delete(`${this.namespaceNewsletters}/senders/${id}`);
	}
}
