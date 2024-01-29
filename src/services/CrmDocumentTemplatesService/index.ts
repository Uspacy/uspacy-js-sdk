import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IDocumentTemplate, IDocumentTemplateFields, IDocumentTemplates } from '../../models/crm-document-template';
import { IDocumentTemplateFieldFilters } from '../../models/crm-filters';

/**
 * CrmDocumentTemplates service
 */
@injectable()
export class CrmDocumentTemplatesService {
	private namespace = '/crm/v1/documents/templates';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get crm document templates list
	 * @param query query string
	 * @param signal AbortSignal for cancelling request
	 * @returns CRM document templates list with meta
	 */
	getDocumentTemplates(query: string, signal: AbortSignal) {
		return this.httpClient.client.get<IDocumentTemplates>(`${this.namespace}/${query}`, { signal });
	}

	/**
	 * Get crm document templates fields
	 * @param params document template fields filter params
	 * @param signal AbortSignal for cancelling request
	 * @returns document templates fields
	 */
	getDocumentTemplatesFields(params: IDocumentTemplateFieldFilters, signal: AbortSignal) {
		return this.httpClient.client.get<IDocumentTemplateFields>(`${this.namespace}/fields`, { signal, params });
	}

	/**
	 * Create crm document template
	 * @param data document template data
	 * @returns document template
	 */
	createTemplate(data: Partial<IDocumentTemplate>) {
		return this.httpClient.client.post<IDocumentTemplate>(this.namespace, data);
	}

	/**
	 * Update crm document template
	 * @param id document template id
	 * @param data document template data
	 * @returns document template
	 */
	updateTemplate(id: number, data: Partial<IDocumentTemplate>) {
		return this.httpClient.client.patch<IDocumentTemplate>(`${this.namespace}/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Delete document template
	 * @param id document template id
	 */
	deleteTemplate(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Mass delete document templates
	 * @param ids document template ids
	 */
	deleteArrayTemplates(ids: number[]) {
		return this.httpClient.client.delete(`${this.namespace}`, {
			params: { ids },
		});
	}
}
