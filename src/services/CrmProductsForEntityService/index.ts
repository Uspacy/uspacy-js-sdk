import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IProductForEntity, IProductForEntityCreate, IProductInfoForEntity } from '../../models/crm-products-for-entity';

/**
 * CrmProductsForEntity service
 */
@injectable()
export class CrmProductsForEntityService {
	private infoNamespace = '/crm/v1/static/entity-product-lists';
	private namespace = '/crm/v1/static/list-products';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get info for entity products
	 * @param entityType entity type
	 * @param entityId entity id
	 * @returns Array crm entity products list
	 */
	getInfoProductsForEntity(entityType: string, entityId: number) {
		return this.httpClient.client.get<IProductInfoForEntity>(this.infoNamespace, {
			params: {
				entity_type: entityType,
				entity_id: entityId,
			},
		});
	}

	/**
	 * Update info for entity products
	 * @param id product id
	 * @param info product info for entity
	 * @returns product info for entity
	 * */
	updateInfoProductForEntity(id: number, info: Partial<IProductInfoForEntity>) {
		return this.httpClient.client.patch<IProductInfoForEntity>(`${this.infoNamespace}/:id`, info, {
			urlParams: { id },
		});
	}

	/**
	 * Get crm entity products list
	 * @returns Array crm entity products list
	 */
	getProductsForEntity() {
		return this.httpClient.client.get<IProductForEntity[]>(this.namespace);
	}

	/**
	 * Get crm entity product
	 * @param id entity product id
	 * @returns entity product
	 * */
	getProductForEntity(id: number) {
		return this.httpClient.client.get<IProductForEntity>(`${this.namespace}/:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Create entity product
	 * @param data entity product data without id
	 * @returns entity product
	 * */
	createProductForEntity(data: Partial<IProductForEntityCreate>) {
		return this.httpClient.client.post<Partial<IProductInfoForEntity>>(this.namespace, data);
	}

	/**
	 * Update entity product
	 * @param id entity product id
	 * @param data entity product data
	 * @returns entity product
	 */
	updateProductForEntity(id: number, data: Partial<IProductForEntity>) {
		return this.httpClient.client.patch<IProductForEntity>(`${this.namespace}/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Update entity products
	 * @param data array of entity products
	 * @returns entity products list
	 */
	updateProductsForEntity(data: Partial<IProductForEntity>[]) {
		return this.httpClient.client.patch<IProductForEntity[]>(`${this.namespace}/bulk`, { list_products: data });
	}

	/**
	 * Delete entity product
	 * @param id entity product id
	 */
	deleteProductForEntity(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Delete entity products
	 * @param ids array of entity products ids
	 */
	deleteProductsForEntity(ids: number[]) {
		return this.httpClient.client.delete(`${this.namespace}/bulk`, {
			params: {
				list_products: ids,
			},
		});
	}
}
