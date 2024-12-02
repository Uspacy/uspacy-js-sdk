import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IEntityData, IEntityMainData } from '../../models/crm-entities';
import { IFunnel } from '../../models/crm-funnel';
import { IMassActions } from '../../models/crm-mass-actions';
import { IReason, IReasonsCreate, IStage } from '../../models/crm-stages';
import { IField } from '../../models/field';
import { IResponseWithMeta } from '../../models/response';

/**
 * CrmEntities service
 */
@injectable()
export class CrmEntitiesService {
	private namespace = '/crm/v1/entities';
	private entityNamespace = '/crm/v1/entity';
	private reasonsNamespace = '/crm/v1/reasons';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get crm entities list
	 * @returns Array crm entities list
	 */
	getEntities() {
		return this.httpClient.client.get<IResponseWithMeta<IEntityMainData>>(this.entityNamespace);
	}

	/**
	 * Get crm entities list with funnels
	 * @returns Array crm entities list
	 * */
	getEntitiesWithFunnels() {
		return this.httpClient.client.get<IResponseWithMeta<IEntityMainData>>(this.entityNamespace, {
			params: {
				'with-funnels': true,
			},
		});
	}

	/**
	 * Create crm entity
	 * @param data entity data without id
	 * @returns entity
	 */
	createEntity(data: Partial<IEntityMainData>) {
		return this.httpClient.client.post<IEntityMainData>(this.entityNamespace, data);
	}

	/**
	 * Delete crm entity
	 * @param id entity id
	 */
	deleteEntity(id: number) {
		return this.httpClient.client.delete(`${this.entityNamespace}/:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Update crm entity
	 * @param id entity id
	 * @param data entity data
	 * @returns entity
	 */
	updateEntity(id: number, data: Partial<IEntityMainData>) {
		return this.httpClient.client.patch<IEntityMainData>(`${this.entityNamespace}/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Get entity funnel
	 * @param code entity code
	 * @returns entity funnels
	 */
	getEntityFunnel(code: string) {
		return this.httpClient.client.get<IFunnel[]>(`${this.namespace}/:code/funnel`, {
			urlParams: { code },
		});
	}

	/**
	 * Get entity fields
	 * @param code entity code
	 * @returns entity fields
	 */
	getEntityFields(code: string) {
		return this.httpClient.client.get<IResponseWithMeta<IField>>(`${this.namespace}/:code/fields`, {
			urlParams: { code },
		});
	}

	/**
	 * Update entity field
	 * @param code entity code
	 * @param fieldCode field code
	 * @param data field data
	 * @returns entity field
	 */
	updateEntityField(code: string, fieldCode: string, data: IField) {
		return this.httpClient.client.patch<IField>(`${this.namespace}/:code/fields/:fieldCode`, data, {
			urlParams: { code, fieldCode },
		});
	}

	/**
	 * Update entity list values
	 * @param code entity code
	 * @param fieldCode field code
	 * @param data field values data
	 * @returns values of entity field
	 */
	updateEntityListValues(code: string, fieldCode: string, data: IField['values']) {
		return this.httpClient.client.post<IField['values']>(`${this.namespace}/:code/lists/:fieldCode`, data, {
			urlParams: { code, fieldCode },
		});
	}

	/**
	 * Create entity field
	 * @param code entity code
	 * @param data field data
	 * @returns entity field
	 */
	createEntityField(code: string, data: Partial<IField>) {
		return this.httpClient.client.post<IField>(`${this.namespace}/:code/fields`, data, {
			urlParams: { code },
		});
	}

	/**
	 * Delete entity list values
	 * @param code entity code
	 * @param fieldCode entity field code
	 * @param value entity list value
	 */
	deleteEntityListValues(code: string, fieldCode: string, value: string) {
		return this.httpClient.client.delete(`${this.namespace}/:code/lists/:fieldCode/:value`, {
			urlParams: { code, fieldCode, value },
		});
	}

	/**
	 * Delete entity field
	 * @param code entity code
	 * @param fieldCode entity field code
	 */
	deleteEntityField(code: string, fieldCode: string) {
		return this.httpClient.client.delete(`${this.namespace}/:code/fields/:fieldCode`, {
			urlParams: { code, fieldCode },
		});
	}

	/**
	 * Create funnel for entity
	 * @param code entity code
	 * @param data funnel data
	 * @returns entity funnel
	 * */
	createEntityFunnel(code: string, data: Partial<IFunnel>) {
		return this.httpClient.client.post<IFunnel>(`${this.namespace}/:code/funnel`, data, {
			urlParams: { code },
		});
	}

	/**
	 * Update funnel for entity
	 * @param code entity code
	 * @param funnelId funnel id
	 * @param data funnel data
	 * @returns entity funnel
	 * */
	updateEntityFunnel(code: string, funnelId: number, data: Partial<IFunnel>) {
		return this.httpClient.client.patch<IFunnel>(`${this.namespace}/:code/funnel/:funnelId`, data, {
			urlParams: { code, funnelId },
		});
	}

	/**
	 * Delete funnel for entity
	 * @param code entity code
	 * @param funnelId funnel id
	 * */
	deleteEntityFunnel(code: string, funnelId: number) {
		return this.httpClient.client.delete(`${this.namespace}/:code/funnel/:funnelId`, {
			urlParams: { code, funnelId },
		});
	}

	/**
	 * Create stage for entity
	 * @param code entity code
	 * @param data stage data
	 * @returns entity stage
	 * */
	createEntityStage(code: string, data: Partial<IStage>) {
		return this.httpClient.client.post<IStage>(`${this.namespace}/:code/kanban/stage`, data, {
			urlParams: { code },
		});
	}

	/**
	 * Update stage for entity
	 * @param code entity code
	 * @param stageId stage id
	 * @param data stage data
	 * @returns entity stage
	 * */
	updateEntityStage(code: string, stageId: number, data: Partial<IStage>) {
		return this.httpClient.client.patch<IStage>(`${this.namespace}/:code/kanban/stage/:stageId`, data, {
			urlParams: { code, stageId },
		});
	}

	/**
	 * Delete stage for entity
	 * @param code entity code
	 * @param stageId stage id
	 * */
	deleteEntityStage(code: string, stageId: number) {
		return this.httpClient.client.delete(`${this.namespace}/:code/kanban/stage/:stageId`, {
			urlParams: { code, stageId },
		});
	}

	/**
	 * Get entity stages
	 * @param code entity code
	 * @param funnelId funnel id
	 * @returns entity stages
	 * */
	getEntityStages(code: string, funnelId?: number) {
		return this.httpClient.client.get<IResponseWithMeta<IStage>>(`${this.namespace}/:code/kanban/stage`, {
			urlParams: { code, funnelId },
			params: { funnel_id: funnelId },
		});
	}

	/**
	 * Create reasons for entity
	 * @param funnelId funnel id
	 * @param data reasons data
	 * @returns entity reasons
	 * */
	createEntityReason(funnelId: number, data: Partial<IReasonsCreate>) {
		return this.httpClient.client.post<IReason>(`${this.reasonsNamespace}/:funnelId`, data, {
			urlParams: { funnelId },
		});
	}

	/**
	 * Update reasons for entity
	 * @param reasonId reason id
	 * @param data reasons data
	 * @returns entity reasons
	 * */
	updateEntityReason(reasonId: number, data: Partial<IReason>) {
		return this.httpClient.client.patch<IReason>(`${this.reasonsNamespace}/:reasonId`, data, {
			urlParams: { reasonId },
		});
	}

	/**
	 * Delete reasons for entity
	 * @param reasonId reason id
	 * */
	deleteEntityReason(reasonId: number) {
		return this.httpClient.client.delete(`${this.reasonsNamespace}/:reasonId`, {
			urlParams: { reasonId },
		});
	}

	/**
	 * Get leads reasons list
	 * @param leadsId id of leads entity
	 * @returns Array with leads reasons
	 */
	getEntityReasons(entityId: number) {
		return this.httpClient.client.get<IReason[]>(`${this.reasonsNamespace}/:entityId`, {
			urlParams: { entityId },
		});
	}

	/**
	 * Get entity items list
	 * @param code entity code
	 * @returns entity items list
	 * */
	getEntityItems(code: string) {
		return this.httpClient.client.get<IEntityData>(`${this.namespace}/:code`, {
			urlParams: { code },
			params: { list: 20 },
		});
	}

	/**
	 * Get entity item
	 * @param code entity code
	 * @param id entity item id
	 * @returns entity item
	 * */
	getEntityItem(code: string, id: number | string) {
		return this.httpClient.client.get<IEntityData>(`${this.namespace}/:code/:id`, {
			urlParams: { code, id },
		});
	}

	/**
	 * Get entity items list with filters
	 * @param code entity code
	 * @param params entity items list filter params
	 * @param signal AbortSignal for cancelling request
	 * @param relatedEntityId related entity id if fetching related to entity  items
	 * @param relatedEntityType related entity type if fetching related to entity  items
	 * @returns Array crm entity items list
	 */
	getEntityItemsWithFilters(code: string, params: object, signal?: AbortSignal, relatedEntityId?: string, relatedEntityType?: string) {
		const getLink = () => {
			const isFetchingRelated = relatedEntityId && relatedEntityType;

			if (isFetchingRelated) {
				return `${this.namespace}/:relatedEntityType/:relatedEntityId/related/:code/`;
			}
			return `${this.namespace}/:code/`;
		};

		return this.httpClient.client.get<IResponseWithMeta<IEntityData>>(getLink(), {
			signal,
			params,
			urlParams: {
				relatedEntityType: relatedEntityType,
				relatedEntityId: relatedEntityId,
				code,
			},
		});
	}

	/**
	 * Create entity item
	 * @param code entity code
	 * @param data entity item data without id
	 * @returns entity item
	 * */
	createEntityItem(code: string, data: Partial<IEntityData>) {
		return this.httpClient.client.post<IEntityData>(`${this.namespace}/:code`, data, {
			urlParams: { code },
		});
	}

	/**
	 * Update entity item
	 * @param code entity code
	 * @param id entity item id
	 * @param data entity item data
	 * @returns entity item
	 */
	updateEntityItem(code: string, id: number, data: Partial<IEntityData>) {
		return this.httpClient.client.patch<IEntityData>(`${this.namespace}/:code/:id`, data, {
			urlParams: { code, id },
		});
	}

	/**
	 * Delete entity item
	 * @param code entity code
	 * @param id entity item id
	 */
	deleteEntityItem(code: string, id: number) {
		return this.httpClient.client.delete(`${this.namespace}/:code/:id`, {
			urlParams: { code, id },
		});
	}

	/**
	 * Mass deleting entity items
	 * @param code entity code
	 * @param entityIds entity items ids to edit
	 * @param exceptIds entity items ids to exclude from editing
	 * @param all should edit all entity items
	 * @param params query params if editing all entity items
	 */
	massEntityItemsDeletion(code: string, { entityIds, exceptIds, all, params }: IMassActions) {
		const data = { all, entity_ids: entityIds, except_ids: exceptIds };

		const suffix = typeof params === 'string' ? `/?${params}` : '';

		return this.httpClient.client.delete(`${this.namespace}/:code/mass_deletion${suffix}`, {
			data,
			urlParams: { code },
			params: typeof params === 'object' ? params : undefined,
		});
	}

	/**
	 * Mass editing entity items
	 * @param code entity code
	 * @param entityIds entity items ids to edit
	 * @param exceptIds entity items ids to exclude from editing
	 * @param all should edit all entity items
	 * @param params query params if editing all entity items
	 * @param payload editing payload
	 * @param settings editing settings
	 */
	massEntityItemsEditing(code: string, { entityIds, exceptIds, all, params, payload, settings }: IMassActions) {
		const data = {
			all,
			entity_ids: entityIds,
			except_ids: exceptIds,
			payload,
			settings,
		};
		const suffix = typeof params === 'string' ? `/?${params}` : '';

		return this.httpClient.client.patch(`${this.namespace}/:code/mass_edit${suffix}`, data, {
			urlParams: { code },
			params: typeof params === 'object' ? params : undefined,
		});
	}

	/**
	 * Mass editing entity stage items
	 * @param code entity code
	 * @param entityIds entity items ids to edit
	 * @param exceptIds entity items ids to exclude from editing
	 * @param all should edit all entity items
	 * @param params query params if editing all entity items
	 * @param payload editing payload
	 * @param settings editing settings
	 */
	massEntityItemsStageEditing(code: string, { entityIds, exceptIds, all, params, payload, settings }: IMassActions) {
		const data = {
			all,
			entity_ids: entityIds,
			except_ids: exceptIds,
			payload,
			settings,
		};
		const suffix = typeof params === 'string' ? `/?${params}` : '';

		return this.httpClient.client.patch(`${this.namespace}/:code/mass_stage_change${suffix}`, data, {
			urlParams: { code },
			params: typeof params === 'object' ? params : undefined,
		});
	}

	/**
	 * Move entity item from stage to stage
	 * @param code entity code
	 * @param entityId entity item id
	 * @param stageId stage id
	 * @param reasonId reason id
	 * @returns entity item
	 */
	moveEntityItemFromStageToStage(code: string, entityId: number, stageId: number, reasonId: number | null) {
		return this.httpClient.client.post(
			`${this.namespace}/:code/:entityId/move/stage/:stageId`,
			{ reason_id: reasonId },
			{
				urlParams: { entityId, stageId, code },
			},
		);
	}

	/**
	 * Create entity item from kanban
	 * @param code entity code
	 * @param data entity item data without id
	 * @returns entity item
	 * */
	createEntityItemFromKanban(code: string, data: Partial<IEntityData>) {
		return this.httpClient.client.post<IEntityData>(`${this.namespace}/:code`, data, {
			urlParams: { code },
		});
	}

	/**
	 * Get entity items list with filters by stage id
	 * @param code entity code
	 * @param params entity items list filter params
	 * @param stageId stage id
	 * @returns Array crm entity items list
	 */
	getEntityItemsByStage(code: string, params: object, stageId: string) {
		return this.httpClient.client.get(`${this.namespace}/:code/kanban/stage/:stageId`, {
			params,
			urlParams: { code, stageId },
		});
	}
}
