import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IProductCategories, IProductCategory } from '../../models/crm-products-category';

/**
 * CrmProductCategories service
 */
@injectable()
export class CrmProductsCategoryService {
	private namespace = '/crm/v1/static/product-categories';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get crm product categories list
	 * @returns Array crm product categories list with meta
	 */
	getProductCategories() {
		return this.httpClient.client.get<IProductCategories>(this.namespace);
	}

	/**
	 * Create product category
	 * @param data product category data without id
	 * @returns product category entity
	 * */
	createProductCategory(data: Partial<Pick<IProductCategory, 'name' | 'parent_id'>>) {
		return this.httpClient.client.post<IProductCategory>(this.namespace, data);
	}

	/**
	 * Update product category
	 * @param id product category id
	 * @param data product category data
	 * @returns product category entity
	 */
	updateProductCategory(id: number, data: Partial<IProductCategory>) {
		return this.httpClient.client.patch<IProductCategory>(`${this.namespace}/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Delete product category
	 * @param id product category id
	 * @param removeWithChild
	 */
	deleteProductCategory(id: number, removeWithChild = false) {
		return this.httpClient.client.delete(`${this.namespace}/:id`, {
			urlParams: { id },
			params: {
				...(removeWithChild && { child_categories: 'delete' }),
			},
		});
	}
}
