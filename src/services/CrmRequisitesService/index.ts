import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IBankUpdateData, IRequisitesResponse } from '../../models/crm-requisite';
import { IRequisite } from '../../models/requisites';
import { IRequisiteParams } from './dto/requisite-params.dto';

/**
 * CrmRequisites service
 */
@injectable()
export class CrmRequisitesService {
	private namespace = '/crm/v1/requisites';

	constructor(private httpClient: HttpClient) {}
	/**
	 * Get crm requisite templates list
	 * @param page page number
	 * @param list list number
	 * @returns Array crm requisite templates list with meta
	 * */
	getTemplates(params: { page: number; list: number }) {
		return this.httpClient.client.get<IRequisitesResponse>(`${this.namespace}/templates`, {
			params,
		});
	}

	/**
	 * Get crm requisite list
	 * @param params requisite list filter params
	 * @returns Array crm requisite list with meta
	 * */
	getCardRequisites(params: IRequisiteParams) {
		return this.httpClient.client.get<IRequisitesResponse>(`${this.namespace}`, {
			params,
		});
	}

	/**
	 * Create crm requisite
	 * @param data requisite data without id
	 * @param params requisite list filter params
	 * @returns requisite entity
	 * */
	createCardRequisites(data: Partial<IRequisite>, params: IRequisiteParams) {
		return this.httpClient.client.post<IRequisite>(`${this.namespace}`, data, {
			params,
		});
	}

	/**
	 * Update crm requisite
	 * @param id requisite id
	 * @param data requisite data
	 * @returns requisite entity
	 */
	updateCardRequisites(id: number, data: Partial<IRequisite>) {
		return this.httpClient.client.patch<IRequisite>(`${this.namespace}/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Attach crm requisite
	 * @param params requisite list filter params
	 * @returns requisite entity
	 */
	attachCardRequisites(params: IRequisiteParams) {
		return this.httpClient.client.post<IRequisite>(`${this.namespace}/references/attach-reference`, undefined, {
			params,
		});
	}

	/**
	 * Delete crm requisite
	 * @param id requisite id
	 */
	deleteCardRequisites(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Create crm bank requisite
	 * @param requisiteId requisite id
	 * @param data bank requisite data without id
	 * @returns bank requisite entity
	 */
	createBankRequisites(requisiteId: number, data: IBankUpdateData) {
		return this.httpClient.client.post<IRequisite>(`${this.namespace}/:requisiteId/bank_requisites`, data, {
			urlParams: { requisiteId },
		});
	}

	/**
	 * Update crm bank requisite
	 * @param requisiteId requisite id
	 * @param bankRequisiteId bank requisite id
	 * @param data bank requisite data
	 * @returns bank requisite entity
	 */
	updateBankRequisites(requisiteId: number, bankRequisiteId: number, data: IBankUpdateData) {
		return this.httpClient.client.patch<IRequisite>(`${this.namespace}/:requisiteId/bank_requisites/:bankRequisiteId`, data, {
			urlParams: { requisiteId, bankRequisiteId },
		});
	}

	/**
	 * Delete crm bank requisite
	 * @param requisiteId requisite id
	 * @param bankRequisiteId bank requisite id
	 */
	deleteBankRequisites(requisiteId: number, bankRequisiteId: number) {
		return this.httpClient.client.delete(`${this.namespace}/:requisiteId/bank_requisites/:bankRequisiteId`, {
			urlParams: { requisiteId, bankRequisiteId },
		});
	}

	/**
	 * Attach crm bank requisite
	 * @param requisiteId requisite id
	 * @param params requisite list filter params
	 * @returns requisite entity
	 */
	attachBankRequisites(requisiteId: number, params: IRequisiteParams) {
		return this.httpClient.client.post<IRequisite>(`${this.namespace}/:requisiteId/bank_requisites/references/attach-reference`, undefined, {
			urlParams: { requisiteId },
			params,
		});
	}
}
