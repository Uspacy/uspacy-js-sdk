import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { ICall, ICalls } from '../../models/crm-calls';
import { ICallFilters } from '../../models/crm-filters';

/**
 * CrmCalls service
 */
@injectable()
export class CrmCallsService {
	private namespace = '/crm/v1/events/call';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get crm calls list
	 * @returns Array crm calls list
	 */
	getCalls() {
		return this.httpClient.client.get<ICalls>(this.namespace);
	}

	/**
	 * Get crm calls list with filters
	 * @param params crm calls list filter params
	 * @returns Array crm calls entity
	 */
	getCallsWithFilters(params: Omit<ICallFilters, 'openDatePicker'>) {
		return this.httpClient.client.get<ICalls>(this.namespace, {
			params,
		});
	}

	/**
	 * Create call
	 * @param data call data without id
	 * @returns call entity
	 */
	createCall(data: Partial<ICall>) {
		return this.httpClient.client.post<ICall>(this.namespace, data);
	}

	/**
	 * Update call
	 * @param id call id
	 * @param data call data
	 * @returns call entity
	 */
	editCall(id: number, data: Partial<ICall>) {
		return this.httpClient.client.patch<Partial<ICall>>(`${this.namespace}/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Get call
	 * @param id call id
	 * @returns call entity
	 */
	getCall(id: string) {
		return this.httpClient.client.get<ICall>(`${this.namespace}/:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Delete call
	 * @param id call id
	 */
	deleteCall(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/:id`, {
			urlParams: { id },
		});
	}
}
