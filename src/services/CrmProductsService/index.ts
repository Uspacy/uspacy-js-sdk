import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IEntityData } from '../../models/crm-entities';
import { IProductFilters } from '../../models/crm-filters';
import { IMassActions } from '../../models/crm-mass-actions';
import { IProduct, IProducts } from '../../models/crm-products';
import { IField, IFields } from '../../models/field';

/**
 * CrmProducts service
 */
@injectable()
export class CrmProductsService {
	private namespace = '/crm/v1/static/products';
	private dynamicNamespace = '/crm/v1/entities/products';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get crm products list
	 * @returns Array crm products list with meta
	 */
	getProducts() {
		return this.httpClient.client.get<IProducts>(this.namespace);
	}

	/**
	 * Get products list with filters
	 * @param params products list filter params
	 * @param signal AbortSignal for cancelling request
	 * @param relatedEntityId related entity id if fetching related to entity products
	 * @param relatedEntityType related entity type if fetching related to entity products
	 * @returns Array crm products list
	 */
	getProductsWithFilters(params: Omit<IProductFilters, 'openDatePicker'>, signal: AbortSignal) {
		return this.httpClient.client.get<IProducts>(this.namespace, {
			signal: signal,
			params,
		});
	}

	/**
	 * Create product
	 * @param data product data without id
	 * @returns product entity
	 * */
	createProduct(data: Partial<IProduct>) {
		return this.httpClient.client.post<IProduct>(this.namespace, data);
	}

	/**
	 * Update product
	 * @param id product id
	 * @param data product data
	 * @returns product entity
	 */
	updateProduct(id: number, data: Partial<IProduct>) {
		return this.httpClient.client.patch<IProduct>(`${this.namespace}/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Delete product
	 * @param id product id
	 */
	deleteProduct(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Mass deleting products
	 * @param entityIds product ids to edit
	 * @param exceptIds product ids to exclude from editing
	 * @param all should edit all products
	 * @param params query params if editing all products
	 */
	massProductsDeletion({ entityIds, exceptIds, all, params }: IMassActions) {
		return this.httpClient.client.delete(`${this.namespace}/mass_deletion${params}`, {
			data: { all, entity_ids: entityIds, except_ids: exceptIds },
		});
	}

	/**
	 * Mass editing products
	 * @param entityIds product ids to edit
	 * @param exceptIds product ids to exclude from editing
	 * @param all should edit all products
	 * @param params query params if editing all products
	 * @param payload editing payload
	 * @param settings editing settings
	 */
	massProductsEditing({ entityIds, exceptIds, all, params, payload, settings }: IMassActions) {
		return this.httpClient.client.patch(`${this.namespace}/mass_edit${params}`, {
			all,
			entity_ids: entityIds,
			except_ids: exceptIds,
			payload,
			settings,
		});
	}

	/**
	 * Get product fields
	 * @returns product field list
	 */
	getProductFields() {
		return this.httpClient.client.get<IFields>(`${this.dynamicNamespace}/fields`);
	}

	/**
	 * Update product field
	 * @param data product field data
	 * @returns product field
	 */
	updateProductField(data: IField) {
		return this.httpClient.client.patch<IField>(`${this.dynamicNamespace}/fields/:code`, data, {
			urlParams: { code: data?.code },
		});
	}

	/**
	 * Update product list values
	 * @param data product field data
	 * @returns values of product field
	 */
	updateProductListValues(data: IField) {
		return this.httpClient.client.post<IField['values']>(`${this.dynamicNamespace}/lists/:code`, data?.values, {
			urlParams: { code: data?.code },
		});
	}

	/**
	 * Create product field
	 * @param data product field data
	 * @returns product field
	 */
	createProductField(data: IField) {
		return this.httpClient.client.post<IField>(`${this.dynamicNamespace}/fields`, data);
	}

	/**
	 * Delete product list values
	 * @param value product list value
	 * @param fieldCode product field code
	 */
	deleteProductListValues(value: string, fieldCode: string) {
		return this.httpClient.client.delete<IEntityData>(`${this.dynamicNamespace}/lists/:code/:value`, {
			urlParams: { code: fieldCode, value },
		});
	}

	/**
	 * Delete product field
	 * @param code product field code
	 */
	deleteProductField(code: string) {
		return this.httpClient.client.delete<IEntityData>(`${this.dynamicNamespace}/fields/:code`, {
			urlParams: { code },
		});
	}
}
