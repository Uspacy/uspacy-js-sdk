import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { ITax, ITaxes } from '../../models/crm-products-taxes';

/**
 * CrmProductTaxes service
 */
@injectable()
export class CrmProductsTaxesService {
	private namespace = '/crm/v1/static/taxes';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get crm product taxes list
	 * @returns Array crm product taxes list with meta
	 */
	getProductTaxes() {
		return this.httpClient.client.get<ITaxes>(this.namespace);
	}

	/**
	 * Create product tax
	 * @param data product tax data without id
	 * @returns product tax entity
	 * */
	createProductTax(data: Partial<Pick<ITax, 'name' | 'is_active' | 'rate'>>) {
		return this.httpClient.client.post<ITax>(this.namespace, data);
	}

	/**
	 * Update product tax
	 * @param id product tax id
	 * @param data product tax data
	 * @returns product tax entity
	 */
	updateProductTax(id: number, data: Partial<ITax>) {
		return this.httpClient.client.patch<ITax>(`${this.namespace}/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Delete product tax
	 * @param id product tax id
	 */
	deleteProductTax(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/:id`, {
			urlParams: { id },
		});
	}
}
