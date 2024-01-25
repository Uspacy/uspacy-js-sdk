import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IEntity, IEntityData } from '../../models/crm-entities';
import { ILeadFilters } from '../../models/crm-filters';
import { IMassActions } from '../../models/crm-mass-actions';
import { IField } from '../../models/field';

/**
 * CrmLeads service
 */
@injectable()
export class CrmLeadsService {
	private namespace = '/crm/v1/entities/leads';
	private entitiesNamespace = '/crm/v1/entities';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get leads list with filters
	 * @param params leads list filter params
	 * @param signal AbortSignal for cancelling request
	 * @param relatedEntityId related entity id if fetching related to entity leads
	 * @param relatedEntityType related entity type if fetching related to entity leads
	 * @returns Array crm leads list
	 */
	getLeadsWithFilters(params: Omit<ILeadFilters, 'openDatePicker'>, signal: AbortSignal, relatedEntityId?: string, relatedEntityType?: string) {
		const getLink = () => {
			const isFetchingRelated = relatedEntityId && relatedEntityType;

			if (isFetchingRelated) {
				return `${this.entitiesNamespace}/:relatedEntityType/:relatedEntityId/related/leads`;
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
	 * Get crm leads list
	 * @returns Array crm leads list with meta
	 */
	getLeadsByStage(stageId: number) {
		return this.httpClient.client.get<IEntity>(`${this.namespace}/kanban/stage/:stageId`, {
			urlParams: {
				stageId,
			},
			params: {
				list: 9999,
			},
		});
	}

	/**
	 * Create lead
	 * @param data lead data without id
	 * @returns lead entity
	 * */
	createLead(data: Partial<IEntityData>) {
		return this.httpClient.client.post<IEntityData>(this.namespace, data);
	}

	/**
	 * Update lead
	 * @param id lead id
	 * @param data lead data
	 * @returns lead entity
	 */
	updateLead(id: number, data: Partial<IEntityData>) {
		return this.httpClient.client.patch<IEntityData>(`${this.namespace}/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Delete lead
	 * @param id lead id
	 */
	deleteLead(id: number) {
		return this.httpClient.client.delete<IEntityData>(`${this.namespace}/:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Mass deleting leads
	 * @param entityIds lead ids to edit
	 * @param exceptIds lead ids to exclude from editing
	 * @param all should edit all leads
	 * @param params query params if editing all leads
	 */
	massLeadsDeletion({ entityIds, exceptIds, all, params }: IMassActions) {
		return this.httpClient.client.delete(`${this.namespace}/mass_deletion${params}`, {
			data: { all, entity_ids: entityIds, except_ids: exceptIds },
		});
	}

	/**
	 * Mass editing leads
	 * @param entityIds lead ids to edit
	 * @param exceptIds lead ids to exclude from editing
	 * @param all should edit all leads
	 * @param params query params if editing all leads
	 * @param payload editing payload
	 * @param settings editing settings
	 */
	massLeadsEditing({ entityIds, exceptIds, all, params, payload, settings }: IMassActions) {
		return this.httpClient.client.patch<IEntityData>(`${this.namespace}/mass_edit${params}`, {
			all,
			entity_ids: entityIds,
			except_ids: exceptIds,
			payload,
			settings,
		});
	}

	/**
	 * Get lead fields
	 * @returns lead field list
	 */
	getLeadFields() {
		return this.httpClient.client.get<IField[]>(`${this.namespace}/fields`);
	}

	/**
	 * Update lead field
	 * @param data lead field data
	 * @returns lead field
	 */
	updateLeadField(data: IField) {
		return this.httpClient.client.patch<IField>(`${this.namespace}/fields/:code`, data, {
			urlParams: { code: data?.code },
		});
	}

	/**
	 * Update lead list values
	 * @param data lead field data
	 * @returns values of lead field
	 */
	updateLeadListValues(data: IField) {
		return this.httpClient.client.post<IField['values']>(`${this.namespace}/lists/:code`, data?.values, {
			urlParams: { code: data?.code },
		});
	}

	/**
	 * Create lead field
	 * @param data lead field data
	 * @returns lead field
	 */
	createLeadField(data: IField) {
		return this.httpClient.client.post<IField>(`${this.namespace}/fields`, data);
	}

	/**
	 * Delete lead list values
	 * @param value lead list value
	 * @param fieldCode lead field code
	 */
	deleteLeadListValues(value: string, fieldCode: string) {
		return this.httpClient.client.delete<IEntityData>(`${this.namespace}/lists/:code/:value`, {
			urlParams: { code: fieldCode, value },
		});
	}

	/**
	 * Delete lead field
	 * @param code lead field code
	 */
	deleteLeadField(code: string) {
		return this.httpClient.client.delete<IEntityData>(`${this.namespace}/fields/:code`, {
			urlParams: { code },
		});
	}

	moveLeadFromStageToStage(entityId: number, stageId: number, reasonId: number | null) {
		return this.httpClient.client.post(
			`${this.namespace}/:entityId/move/stage/:stageId`,
			{ reason_id: reasonId },
			{
				urlParams: { entityId, stageId },
			},
		);
	}
}
