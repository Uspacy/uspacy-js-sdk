import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IEntity, IEntityData } from '../../models/crm-entities';
import { IMassActions } from '../../models/crm-mass-actions';
import { IField, IFields } from '../../models/field';

/**
 * CrmContacts service
 */
@injectable()
export class CrmContactsService {
	private namespace = '/crm/v1/entities/contacts';
	private entitiesNamespace = '/crm/v1/entities';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get crm contacts list
	 * @returns Array crm contacts list with meta
	 */
	getContacts() {
		return this.httpClient.client.get<IEntity>(this.namespace, {
			params: {
				list: 9999,
			},
		});
	}

	/**
	 * Create contact
	 * @param data contact data without id
	 * @returns contact entity
	 * */
	createContact(data: Partial<IEntityData>) {
		return this.httpClient.client.post<IEntityData>(this.namespace, data);
	}

	/**
	 * Update contact
	 * @param id contact id
	 * @param data contact data
	 * @returns contact entity
	 */
	updateContact(id: number, data: Partial<IEntityData>) {
		return this.httpClient.client.patch<IEntityData>(`${this.namespace}/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Delete contact
	 * @param id contact id
	 */
	deleteContact(id: number) {
		return this.httpClient.client.delete<IEntityData>(`${this.namespace}/:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Mass deleting contacts
	 * @param entityIds contact ids to edit
	 * @param exceptIds contact ids to exclude from editing
	 * @param all should edit all contacts
	 * @param params query params if editing all contacts
	 */
	massContactsDeletion({ entityIds, exceptIds, all, params }: IMassActions) {
		return this.httpClient.client.delete(`${this.namespace}/mass_deletion${params}`, {
			data: { all, entity_ids: entityIds, except_ids: exceptIds },
		});
	}

	/**
	 * Mass editing contacts
	 * @param entityIds contact ids to edit
	 * @param exceptIds contact ids to exclude from editing
	 * @param all should edit all contacts
	 * @param params query params if editing all contacts
	 * @param payload editing payload
	 * @param settings editing settings
	 */
	massContactsEditing({ entityIds, exceptIds, all, params, payload, settings }: IMassActions) {
		return this.httpClient.client.patch(`${this.namespace}/mass_edit${params}`, {
			all,
			entity_ids: entityIds,
			except_ids: exceptIds,
			payload,
			settings,
		});
	}

	/**
	 * Get contacts list with filters
	 * @param params contacts list filter params
	 * @param signal AbortSignal for cancelling request
	 * @param relatedEntityId related entity id if fetching related to entity contacts
	 * @param relatedEntityType related entity type if fetching related to entity contacts
	 * @returns Array crm contacts list
	 */
	getContactsWithFilters(params: string, signal: AbortSignal, relatedEntityId?: string, relatedEntityType?: string) {
		const getLink = () => {
			const isFetchingRelated = relatedEntityId && relatedEntityType;

			if (isFetchingRelated) {
				return `${this.entitiesNamespace}/:relatedEntityType/:relatedEntityId/related/contacts?${params}`;
			}
			return `${this.namespace}?${params}`;
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
	 * Get contact fields
	 * @returns contact field list
	 */
	getContactFields() {
		return this.httpClient.client.get<IFields>(`${this.namespace}/fields`);
	}

	/**
	 * Update contact field
	 * @param data contact field data
	 * @returns contact field
	 */
	updateContactField(data: IField) {
		return this.httpClient.client.patch<IField>(`${this.namespace}/fields/:code`, data, {
			urlParams: { code: data?.code },
		});
	}

	/**
	 * Update contact list values
	 * @param data contact field data
	 * @returns values of contact field
	 */
	updateContactListValues(data: IField) {
		return this.httpClient.client.post<IField['values']>(`${this.namespace}/lists/:code`, data?.values, {
			urlParams: { code: data?.code },
		});
	}

	/**
	 * Create contact field
	 * @param data contact field data
	 * @returns contact field
	 */
	createContactField(data: IField) {
		return this.httpClient.client.post<IField>(`${this.namespace}/fields`, data);
	}

	/**
	 * Delete contact list values
	 * @param value contact list value
	 * @param fieldCode contact field code
	 */
	deleteContactListValues(value: string, fieldCode: string) {
		return this.httpClient.client.delete<IEntityData>(`${this.namespace}/lists/:code/:value`, {
			urlParams: { code: fieldCode, value },
		});
	}

	/**
	 * Delete contact field
	 * @param code contact field code
	 */
	deleteContactField(code: string) {
		return this.httpClient.client.delete<IEntityData>(`${this.namespace}/fields/:code`, {
			urlParams: { code },
		});
	}
}
