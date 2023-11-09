import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { I2FaEnable, I2FaStatus } from '../../models/2fa';
import { IRequisite, IRequisitesResponse, IRequisiteUpdate, ITemplate, ITemplateResponse, ITemplateUpdate } from '../../models/requisites';
import { IResponseWithMessage } from '../../models/response';
import { IPortalSettings } from '../../models/settings';
import { IUser } from '../../models/user';

/**
 * Users service
 */
@injectable()
export class ProfileService {
	private namespace = '/company/v1/users/me';
	private crm_req_namespace = '/crm/v1/requisites';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get 2fa
	 * @returns user portal settings
	 */
	get2FaStatus() {
		return this.httpClient.client.get<I2FaStatus>(`${this.namespace}/twofa_status/`);
	}

	/**
	 * Enable 2fa
	 * @returns user portal settings
	 */
	enable2Fa() {
		return this.httpClient.client.patch<I2FaEnable>(`${this.namespace}/twofa_enable/`);
	}

	/**
	 * Disable 2fa
	 * @returns user portal settings
	 */
	disable2Fa() {
		return this.httpClient.client.patch<IResponseWithMessage>(`${this.namespace}/twofa_disable/`);
	}

	/**
	 * Get self profile
	 * @returns user profile data
	 */
	getProfile() {
		return this.httpClient.client.get<IUser>(`${this.namespace}/`);
	}

	/**
	 * update portal ettings by user id
	 * @param settings
	 * @returns user portal settings
	 */
	getPortalSettings() {
		return this.httpClient.client.get<IPortalSettings>(`${this.namespace}/settings/`);
	}

	/**
	 * update portal ettings by user id
	 * @param settings
	 * @returns user portal settings
	 */
	updatePortalSettings(settings: IPortalSettings) {
		return this.httpClient.client.patch<IPortalSettings>(`${this.namespace}/settings/`, settings);
	}

	/**
	 * get all requisites
	 * @returns all requisites
	 */
	getRequisites() {
		return this.httpClient.client.get<IRequisitesResponse>(`${this.crm_req_namespace}/`);
	}

	/**
	 * update requisite by id
	 * @param body
	 */
	updateRequisite(body: IRequisiteUpdate) {
		return this.httpClient.client.patch<IRequisite>(`${this.crm_req_namespace}/:id`, body, {
			urlParams: {
				id: body.id,
			},
		});
	}

	/**
	 * remove requisite by id
	 * @param id
	 */
	removeRequisite(id: number) {
		return this.httpClient.client.delete(`${this.crm_req_namespace}/:id`, {
			urlParams: {
				id,
			},
		});
	}

	/**
	 * get templates
	 * @param page count of page
	 * @param list count of elements on page
	 * @returns templates
	 */
	getTemplates(page?: number, list?: number) {
		return this.httpClient.client.get<ITemplateResponse>(`${this.crm_req_namespace}/templates`, {
			params: {
				page,
				list,
			},
		});
	}

	/**
	 * get basic templates
	 * @returns basic templates
	 */
	getBasicTemplates() {
		return this.httpClient.client.get<ITemplateResponse>(`${this.crm_req_namespace}/templates/basic-templates`);
	}

	/**
	 * update template
	 * @param body updated fields in template
	 * @returns updated template
	 */
	updateTemplate(body: ITemplateUpdate) {
		return this.httpClient.client.patch<IRequisite>(`${this.crm_req_namespace}/templates/:id`, body, {
			urlParams: {
				id: body.id,
			},
		});
	}

	/**
	 * create template
	 * @param body new template
	 * @returns new template
	 */
	createTemplate(body: ITemplate) {
		return this.httpClient.client.post<IRequisite>(`${this.crm_req_namespace}/templates`, body);
	}

	/**
	 * remove template by id
	 * @param id
	 */
	removeTemplate(id: number) {
		return this.httpClient.client.delete(`${this.crm_req_namespace}/templates/:id`, {
			urlParams: {
				id,
			},
		});
	}

	/**
	 * get all bank requisites for current requisite
	 * @param id requisite id
	 * @returns all attached bank requisites
	 */
	getBankRequisitesById(id: number) {
		return this.httpClient.client.get<IRequisitesResponse>(`${this.crm_req_namespace}/:id/bank_requisites/`, {
			urlParams: {
				id,
			},
		});
	}
}
