import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IEntity, IEntityData } from '../../models/crm-entities';
import { IMassActions } from '../../models/crm-mass-actions';
import { IField, IFields } from '../../models/field';

/**
 * CrmCompanies service
 */
@injectable()
export class CrmCompaniesService {
	private namespace = '/crm/v1/entities/companies';
	private entitiesNamespace = '/crm/v1/entities';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get crm companies list
	 * @returns Array crm companies list with meta
	 */
	getCompanies() {
		return this.httpClient.client.get<IEntity>(this.namespace, {
			params: {
				list: 9999,
			},
		});
	}

	/**
	 * Create company
	 * @param data company data without id
	 * @returns company entity
	 * */
	createCompany(data: Partial<IEntityData>) {
		return this.httpClient.client.post<IEntityData>(this.namespace, data);
	}

	/**
	 * Update company
	 * @param id company id
	 * @param data company data
	 * @returns company entity
	 */
	updateCompany(id: number, data: Partial<IEntityData>) {
		return this.httpClient.client.patch<IEntityData>(`${this.namespace}/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Delete company
	 * @param id company id
	 */
	deleteCompany(id: number) {
		return this.httpClient.client.delete<IEntityData>(`${this.namespace}/:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Mass deleting companies
	 * @param entityIds company ids to edit
	 * @param exceptIds company ids to exclude from editing
	 * @param all should edit all companies
	 * @param params query params if editing all companies
	 */
	massCompaniesDeletion({ entityIds, exceptIds, all, params }: IMassActions) {
		return this.httpClient.client.delete(`${this.namespace}/mass_deletion${params}`, {
			data: { all, entity_ids: entityIds, except_ids: exceptIds },
		});
	}

	/**
	 * Mass editing companies
	 * @param entityIds company ids to edit
	 * @param exceptIds company ids to exclude from editing
	 * @param all should edit all companies
	 * @param params query params if editing all companies
	 * @param payload editing payload
	 * @param settings editing settings
	 */
	massCompaniesEditing({ entityIds, exceptIds, all, params, payload, settings }: IMassActions) {
		return this.httpClient.client.patch(`${this.namespace}/mass_edit${params}`, {
			all,
			entity_ids: entityIds,
			except_ids: exceptIds,
			payload,
			settings,
		});
	}

	/**
	 * Get companies list with filters
	 * @param params companies list filter params
	 * @param signal AbortSignal for cancelling request
	 * @param relatedEntityId related entity id if fetching related to entity companies
	 * @param relatedEntityType related entity type if fetching related to entity companies
	 * @returns Array crm companies list
	 */
	getCompaniesWithFilters(params: string, signal: AbortSignal, relatedEntityId?: string, relatedEntityType?: string) {
		const getLink = () => {
			const isFetchingRelated = relatedEntityId && relatedEntityType;

			if (isFetchingRelated) {
				return `${this.entitiesNamespace}/:relatedEntityType/:relatedEntityId/related/companies?${params}`;
			}
			return `${this.namespace}/?${params}`;
		};

		return this.httpClient.client.get<IEntity>(getLink(), {
			signal: signal,
			urlParams: {
				relatedEntityType: relatedEntityType,
				relatedEntityId: relatedEntityId,
			},
		});
	}

	/**
	 * Get company fields
	 * @returns company field list
	 */
	getCompanyFields() {
		return this.httpClient.client.get<IFields>(`${this.namespace}/fields`);
	}

	/**
	 * Update company field
	 * @param data company field data
	 * @returns company field
	 */
	updateCompanyField(data: IField) {
		return this.httpClient.client.patch<IField>(`${this.namespace}/fields/:code`, data, {
			urlParams: { code: data?.code },
		});
	}

	/**
	 * Update company list values
	 * @param data company field data
	 * @returns values of company field
	 */
	updateCompanyListValues(data: IField) {
		return this.httpClient.client.post<IField['values']>(`${this.namespace}/lists/:code`, data?.values, {
			urlParams: { code: data?.code },
		});
	}

	/**
	 * Create company field
	 * @param data company field data
	 * @returns company field
	 */
	createCompanyField(data: IField) {
		return this.httpClient.client.post<IField>(`${this.namespace}/fields`, data);
	}

	/**
	 * Delete company list values
	 * @param value company list value
	 * @param fieldCode company field code
	 */
	deleteCompanyListValues(value: string, fieldCode: string) {
		return this.httpClient.client.delete<IEntityData>(`${this.namespace}/lists/:code/:value`, {
			urlParams: { code: fieldCode, value },
		});
	}

	/**
	 * Delete company field
	 * @param code company field code
	 */
	deleteCompanyField(code: string) {
		return this.httpClient.client.delete<IEntityData>(`${this.namespace}/fields/:code`, {
			urlParams: { code },
		});
	}
}
