import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IMeasurementUnit, IMeasurementUnits } from '../../models/crm-products-unit';

/**
 * CrmProductUnit service
 */
@injectable()
export class CrmProductsUnitService {
	private namespace = '/crm/v1/static/measurement-units';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get crm product units list
	 * @returns Array crm product units list with meta
	 */
	getProductUnits() {
		return this.httpClient.client.get<IMeasurementUnits>(this.namespace);
	}

	/**
	 * Create product unit
	 * @param data product unit data without id
	 * @returns product unit entity
	 * */
	createProductUnit(data: Partial<Pick<IMeasurementUnit, 'name' | 'abbr'>>) {
		return this.httpClient.client.post<IMeasurementUnit>(this.namespace, data);
	}

	/**
	 * Update product unit
	 * @param id product unit id
	 * @param data product unit data
	 * @returns product unit entity
	 */
	updateProductUnit(id: number, data: Partial<IMeasurementUnit>) {
		return this.httpClient.client.patch<IMeasurementUnit>(`${this.namespace}/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Delete product unit
	 * @param id product unit id
	 */
	deleteProductUnit(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/:id`, {
			urlParams: { id },
		});
	}
}
