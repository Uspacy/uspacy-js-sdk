import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IEntity, IEntityData } from '../../models/crm-entities';
import { IDealFilters } from '../../models/crm-filters';
import { IMassActions } from '../../models/crm-mass-actions';
import { IField, IFields } from '../../models/field';

/**
 * CrmDeals service
 */
@injectable()
export class CrmDealsService {
	private namespace = '/crm/v1/entities/deals';
	private entitiesNamespace = '/crm/v1/entities';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get crm deals list
	 * @returns Array crm deals list with meta
	 */
	getDeals() {
		return this.httpClient.client.get<IEntity>(this.namespace, {
			params: {
				list: 9999,
			},
		});
	}

	/**
	 * Get deals list with filters
	 * @param params deals list filter params
	 * @param signal AbortSignal for cancelling request
	 * @param relatedEntityId related entity id if fetching related to entity deals
	 * @param relatedEntityType related entity type if fetching related to entity deals
	 * @returns Array crm deals list
	 */
	getDealsWithFilters(params: Omit<IDealFilters, 'openDatePicker'>, signal: AbortSignal, relatedEntityId?: string, relatedEntityType?: string) {
		const getLink = () => {
			const isFetchingRelated = relatedEntityId && relatedEntityType;

			if (isFetchingRelated) {
				return `${this.entitiesNamespace}/:relatedEntityType/:relatedEntityId/related/deals`;
			}
			return this.namespace;
		};

		return this.httpClient.client.get<IEntity>(getLink(), {
			signal: signal,
			urlParams: {
				relatedEntityType: relatedEntityType,
				relatedEntityId: relatedEntityId,
			},
			params,
		});
	}

	/**
	 * Create deal
	 * @param data deal data without id
	 * @returns deal entity
	 * */
	createDeal(data: Partial<IEntityData>) {
		return this.httpClient.client.post<IEntityData>(this.namespace, data);
	}

	/**
	 * Update deal
	 * @param id deal id
	 * @param data deal data
	 * @returns deal entity
	 */
	updateDeal(id: number, data: Partial<IEntityData>) {
		return this.httpClient.client.patch<IEntityData>(`${this.namespace}/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Delete deal
	 * @param id deal id
	 */
	deleteDeal(id: number) {
		return this.httpClient.client.delete<IEntityData>(`${this.namespace}/:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Mass deleting deals
	 * @param entityIds deal ids to edit
	 * @param exceptIds deal ids to exclude from editing
	 * @param all should edit all deals
	 * @param params query params if editing all deals
	 */
	massDealsDeletion({ entityIds, exceptIds, all, params }: IMassActions) {
		return this.httpClient.client.delete(`${this.namespace}/mass_deletion${params}`, {
			data: { all, entity_ids: entityIds, except_ids: exceptIds },
		});
	}

	/**
	 * Mass editing deals
	 * @param entityIds deal ids to edit
	 * @param exceptIds deal ids to exclude from editing
	 * @param all should edit all deals
	 * @param params query params if editing all deals
	 * @param payload editing payload
	 * @param settings editing settings
	 */
	massDealsEditing({ entityIds, exceptIds, all, params, payload, settings }: IMassActions) {
		return this.httpClient.client.patch<IEntityData>(`${this.namespace}/mass_edit${params}`, {
			all,
			entity_ids: entityIds,
			except_ids: exceptIds,
			payload,
			settings,
		});
	}

	/**
	 * Get deal fields
	 * @returns deal field list
	 */
	getDealFields() {
		return this.httpClient.client.get<IFields>(`${this.namespace}/fields`);
	}

	/**
	 * Update deal field
	 * @param data deal field data
	 * @returns deal field
	 */
	updateDealField(data: IField) {
		return this.httpClient.client.patch<IField>(`${this.namespace}/fields/:code`, data, {
			urlParams: { code: data?.code },
		});
	}

	/**
	 * Update deal list values
	 * @param data deal field data
	 * @returns values of deal field
	 */
	updateDealListValues(data: IField) {
		return this.httpClient.client.post<IField['values']>(`${this.namespace}/lists/:code`, data?.values, {
			urlParams: { code: data?.code },
		});
	}

	/**
	 * Create deal field
	 * @param data deal field data
	 * @returns deal field
	 */
	createDealField(data: IField) {
		return this.httpClient.client.post<IField>(`${this.namespace}/fields`, data);
	}

	/**
	 * Delete deal list values
	 * @param value deal list value
	 * @param fieldCode deal field code
	 */
	deleteDealListValues(value: string, fieldCode: string) {
		return this.httpClient.client.delete<IEntityData>(`${this.namespace}/lists/:code/:value`, {
			urlParams: { code: fieldCode, value },
		});
	}

	/**
	 * Delete deal field
	 * @param code deal field code
	 */
	deleteDealField(code: string) {
		return this.httpClient.client.delete<IEntityData>(`${this.namespace}/fields/:code`, {
			urlParams: { code },
		});
	}

	moveDealFromStageToStage(entityId: number, stageId: number, reasonId: number | null) {
		return this.httpClient.client.post(
			`${this.namespace}/:entityId/move/stage/:stageId`,
			{ reason_id: reasonId },
			{
				urlParams: { entityId, stageId },
			},
		);
	}
}
