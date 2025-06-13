import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IPriceType, IPriceTypes } from '../../models/crm-products-price-types';

/**
 * CrmProductCategories service
 */
@injectable()
export class CrmProductsPriceTypesService {
	private namespace = '/crm/v1/static/product-price-types';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get crm product price of types list
	 * @returns Array product price types list
	 */
	getProductPriceTypes() {
		return this.httpClient.client.get<IPriceTypes>(this.namespace);
	}

	/**
	 * Create product price type
	 * @param data product price type, title required
	 * @returns product price type entity
	 * */
	createProductPriceType(data: Partial<Pick<IPriceType, 'title'>>) {
		return this.httpClient.client.post<IPriceType>(this.namespace, data);
	}

	/**
	 * Update product category
	 * @param id product price type id
	 * @param data product price type data
	 * @returns product price type entity
	 */
	updateProductPriceType(id: number, data: Partial<IPriceType>) {
		return this.httpClient.client.patch<IPriceType>(`${this.namespace}/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Delete product price type
	 * @param id product price type id
	 */
	deleteProductPriceType(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/:id`, {
			urlParams: { id },
		});
	}
}
