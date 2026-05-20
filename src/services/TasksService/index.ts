/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IField, IFields } from '../../models/field';
import { IResponseWithMeta } from '../../models/response';
import { IChecklist, IChecklistItem, ITask, ITasks, ITasksParams, taskType } from '../../models/tasks';
import { ITransferOfCasesProgress, ITransferTasksData } from '../../models/transferOfCases';
import { updateTaskStatusActionType } from './dto/create-update-task.dto';
import { IMassEditingFieldsPayload } from './dto/mass-actions.dto';

/**
 * Tasks service
 */
@injectable()
export class TasksService {
	private namespace = '/tasks/v1/tasks';
	private namespaceTemplates = '/tasks/v1/templates';
	private namespaceTransferTasks = '/tasks/v1/transfers';
	private namespaceTrashTasks = '/tasks/v1/trash/tasks';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get tasks list with filters
	 * @param params tasks list filter params
	 * @param withoutResponsible withoutResponsible filter param
	 * @returns Array tasks entity
	 */
	getTasks(params: ITasksParams, withoutResponsible?: boolean, signal?: AbortSignal) {
		return this.httpClient.client.get<IResponseWithMeta<ITask>>(this.namespace, {
			params: { ...params, ...(withoutResponsible && { responsible_id: '' }) },
			signal,
		});
	}

	/**
	 * Get recurring templates list
	 * @param params recurring templates filter params
	 * @param withoutResponsible withoutResponsible filter param
	 * @returns Array recurring template entity
	 */
	getRecurringTemplates(params: ITasksParams, withoutResponsible?: boolean, signal?: AbortSignal) {
		return this.httpClient.client.get<IResponseWithMeta<ITask>>(`${this.namespaceTemplates}/recurring`, {
			params: { ...params, ...(withoutResponsible && { responsible_id: '' }) },
			signal,
		});
	}

	/**
	 * Get one time templates list
	 * @param params one time templates filter params
	 * @param withoutResponsible withoutResponsible filter param
	 * @returns Array one time template entity
	 */
	getOneTimeTemplates(params: ITasksParams, withoutResponsible?: boolean, signal?: AbortSignal) {
		return this.httpClient.client.get<IResponseWithMeta<ITask>>(`${this.namespaceTemplates}/one_time`, {
			params: { ...params, ...(withoutResponsible && { responsible_id: '' }) },
			signal,
		});
	}

	/**
	 * Get hierarchies list
	 * @param params one hierarchies filter params
	 * @param withoutResponsible withoutResponsible filter param
	 * @returns Array hierarchy entity
	 */
	getHierarchies(params: ITasksParams, withoutResponsible: boolean, signal: AbortSignal) {
		return this.httpClient.client.get<IResponseWithMeta<ITask>>(`${this.namespace}/hierarchy`, {
			params: { ...params, ...(withoutResponsible && { responsible_id: '' }) },
			signal,
		});
	}

	/**
	 * Create task
	 * @returns task entity
	 */
	createTask(body: Partial<ITask>, type: taskType) {
		const isTaskType = type === 'task';
		return this.httpClient.client.post<ITask>(isTaskType ? this.namespace : `${this.namespaceTemplates}/${type}`, body);
	}

	/**
	 * Replicate task
	 * @returns task entity
	 */
	replicateTask(body: Partial<ITask>, id: string) {
		return this.httpClient.client.post<ITask>(`${this.namespace}/:id/replicate`, body, { urlParams: { id } });
	}

	/**
	 * Update task
	 * @param id task id
	 * @param body task data
	 * @param type task type
	 * @returns task entity
	 */
	updateTask(id: string, body: Partial<ITask>, type: taskType) {
		const isTaskType = type === 'task';
		return this.httpClient.client.patch<ITask>(isTaskType ? `${this.namespace}/:id/` : `${this.namespaceTemplates}/${type}/:id/`, body, {
			urlParams: { id },
		});
	}

	/**
	 * Update task status
	 * @param id task id
	 * @param action status action
	 * @returns task entity
	 */
	updateTaskStatus(id: string, action: updateTaskStatusActionType) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/:id/${action}`, undefined, {
			urlParams: { id },
		});
	}

	/**
	 * Delegation task
	 * @param id task id
	 * @param user_id user id
	 * @returns task entity
	 */
	delegationTask(id: string, user_id: number) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/:id/delegation`, { user_id }, { urlParams: { id } });
	}

	/**
	 * Mass editing tasks
	 * @param taskIds tasks ids
	 * @param exceptIds exception tasks ids
	 * @param all boolean flag for params
	 * @param params params for filters
	 * @param withoutResponsible boolean flag for filters
	 * @param payload mass editing values
	 * @param settings mass editing field settings
	 */
	massEditingTasks(
		taskIds: string[],
		exceptIds: number[],
		all: boolean,
		params?: ITasksParams,
		withoutResponsible?: boolean,
		payload?: IMassEditingFieldsPayload,
		settings?: IMassEditingFieldsPayload,
	) {
		if (all) {
			return this.httpClient.client.post(
				`${this.namespace}/mass_edit/`,
				{ taskIds, exceptIds, all, payload, settings },
				{ params: { ...params, ...(withoutResponsible && { responsible_id: '' }) } },
			);
		}
		return this.httpClient.client.post(`${this.namespace}/mass_edit/`, { taskIds, exceptIds, all, payload, settings });
	}

	/**
	 * Delete task
	 * @param id task id
	 */
	deleteTask(id: string) {
		return this.httpClient.client.delete<ITask>(`${this.namespace}/:id/`, { urlParams: { id } });
	}

	/**
	 * Mass deletion tasks
	 * @param taskIds tasks ids
	 * @param exceptIds exception tasks ids
	 * @param all boolean flag for params
	 * @param params params for filters
	 * @param withoutResponsible boolean flag for filters
	 */
	massDeletionTasks(taskIds: string[], exceptIds: number[], all: boolean, params?: ITasksParams, withoutResponsible?: boolean) {
		if (all) {
			return this.httpClient.client.post(
				`${this.namespace}/mass_deletion/`,
				{ taskIds, exceptIds, all },
				{ params: { ...params, ...(withoutResponsible && { responsible_id: '' }) } },
			);
		}
		return this.httpClient.client.post(`${this.namespace}/mass_deletion/`, { taskIds, exceptIds, all });
	}

	/**
	 * Mass completion tasks
	 * @param taskIds tasks ids
	 * @param exceptIds exception tasks ids
	 * @param all boolean flag for params
	 * @param params params for filters
	 * @param withoutResponsible boolean flag for filters
	 */
	massCompletionTasks(taskIds: string[], exceptIds: number[], all: boolean, params?: ITasksParams, withoutResponsible?: boolean) {
		if (all) {
			return this.httpClient.client.post(
				`${this.namespace}/mass_ready/`,
				{ taskIds, exceptIds, all },
				{ params: { ...params, ...(withoutResponsible && { responsible_id: '' }) } },
			);
		}
		return this.httpClient.client.post(`${this.namespace}/mass_ready/`, { taskIds, exceptIds, all });
	}

	/**
	 * Get tasks fields
	 * @returns tasks fields
	 */
	getTasksField() {
		return this.httpClient.client.get<IFields>(`${this.namespace}/fields`);
	}

	/**
	 * Transfer tasks
	 * @returns transfer tasks quantity
	 */
	transferTasks(body: Partial<ITransferTasksData>) {
		return this.httpClient.client.post<ITransferTasksData>(`${this.namespaceTransferTasks}/user`, body);
	}

	/**
	 * Transfer tasks quantity
	 * @returns transfer tasks quantity
	 */
	getTransferTasksQuantity(body: Partial<ITransferTasksData>) {
		return this.httpClient.client.post<ITransferTasksData>(`${this.namespaceTransferTasks}/quantity`, body);
	}

	/**
	 * Transfer tasks progress
	 * @returns transfer tasks progress
	 */
	getTransferTasksProgress() {
		return this.httpClient.client.get<ITransferOfCasesProgress>(`${this.namespaceTransferTasks}/progress`);
	}

	/**
	 * Stop transfer tasks
	 */
	stopTransferTasks() {
		return this.httpClient.client.get(`${this.namespaceTransferTasks}/stop`);
	}

	/**
	 * Get tasks fields
	 * @returns tasks fields
	 */
	getTasksFields() {
		return this.httpClient.client.get<IResponseWithMeta<IField>>(`${this.namespace}/fields`);
	}

	/**
	 * Update tasks field
	 * @param fieldCode field code
	 * @param data field data
	 * @returns entity field
	 */
	updateTasksField(fieldCode: string, data: IField) {
		return this.httpClient.client.patch<IField>(`${this.namespace}/fields/:fieldCode`, data, {
			urlParams: { fieldCode },
		});
	}

	/**
	 * Update tasks list values
	 * @param data field values data
	 * @returns values of tasks field
	 */
	updateTasksListValues(data: IField) {
		return this.httpClient.client.post<IField['values']>(`${this.namespace}/fields/lists/:fieldCode`, data.values, {
			urlParams: { fieldCode: data.code },
		});
	}

	/**
	 * Create tasks field
	 * @param data field data
	 * @returns tasks field
	 */
	createTasksField(data: Partial<IField>) {
		return this.httpClient.client.post<IField>(`${this.namespace}/fields`, data);
	}

	/**
	 * Delete tasks list values
	 * @param fieldCode tasks field code
	 * @param value tasks list value
	 */
	deleteTasksListValues(fieldCode: string, value: string) {
		return this.httpClient.client.delete(`${this.namespace}/fields/lists/:fieldCode/:value`, {
			urlParams: { fieldCode, value },
		});
	}

	/**
	 * Delete tasks field
	 * @param fieldCode field code
	 */
	deleteTasksField(fieldCode: string) {
		return this.httpClient.client.delete(`${this.namespace}/fields/:fieldCode`, {
			urlParams: { fieldCode },
		});
	}

	/**
	 * Get deleted(trash) tasks
	 * @param params task list filter params
	 * @param signal AbortSignal for cancelling request
	 * @returns activity list
	 */
	getTrashTasks(params: string | object, signal?: AbortSignal) {
		const suffix = typeof params === 'string' ? `/?${params}` : '';
		return this.httpClient.client.get<ITasks>(`${this.namespaceTrashTasks}${suffix}`, {
			signal,
			params: typeof params === 'object' ? params : undefined,
		});
	}

	/**
	 * Get deleted(trash) task
	 * @param id item id
	 * @returns activity item
	 */
	getTrashTask(id: number) {
		return this.httpClient.client.get<ITask>(`${this.namespaceTrashTasks}`, {
			params: {
				id,
			},
		});
	}

	/**
	 * Restore tasks
	 * @param itemIds restore items by ids
	 * @param all all items restore
	 * @param exceptIds items that don't need to be restored
	 * @param filterParams filters
	 */
	restoreTrashTasks({ itemIds, all, exceptIds, filterParams }: { itemIds: number[]; all: boolean; exceptIds: number[]; filterParams?: object }) {
		return this.httpClient.client.patch(
			`${this.namespaceTrashTasks}/restore`,
			{
				id: itemIds,
				all,
				except_ids: exceptIds,
			},
			{
				params: {
					...(filterParams || {}),
				},
			},
		);
	}

	/**
	 * Remove from basket tasks
	 * @param itemIds delete items by ids
	 * @param all all items delete
	 * @param exceptIds items that don't need to be delete
	 * @param filterParams filters
	 */
	deleteTrashTasks({ itemIds, all, exceptIds, filterParams }: { itemIds: number[]; all: boolean; exceptIds: number[]; filterParams?: object }) {
		return this.httpClient.client.delete(`${this.namespaceTrashTasks}`, {
			data: {
				id: itemIds,
				all,
				except_ids: exceptIds,
			},
			params: {
				...(filterParams || {}),
			},
		});
	}

	/**
	 * Create checklist
	 * @param id task id
	 * @param checklist checklist entity
	 * @returns checklist entity
	 */
	createChecklist(taskId: string, body: Partial<IChecklist>) {
		return this.httpClient.client.post<ITask>(`${this.namespace}/:taskId/checklists/`, body, {
			urlParams: { taskId },
		});
	}

	/**
	 * Update checklist
	 * @param id checklist id
	 * @param body checklist entity
	 * @returns checklist entity
	 */
	updateChecklist(id: number, body: Partial<IChecklist>) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/checklists/:id`, body, {
			urlParams: { id },
		});
	}

	/**
	 * Delete checklist
	 * @param id checklist id
	 */
	deleteChecklist(id: number) {
		return this.httpClient.client.delete<ITask>(`${this.namespace}/checklists/:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Create checklist item
	 * @param id checklist id
	 * @param body checklist item entity
	 * @returns checklist item entity
	 */
	createChecklistItem(id: number, body: Partial<IChecklistItem>) {
		return this.httpClient.client.post<ITask>(`${this.namespace}/checklists/:id/items`, body, {
			urlParams: { id },
		});
	}

	/**
	 * Update checklist item
	 * @param id checklist id
	 * @param itemId checklist item id
	 * @param body checklist item entity
	 * @returns checklist item entity
	 */
	updateChecklistItem(id: number, itemId: number, body: Partial<IChecklistItem>) {
		return this.httpClient.client.patch<ITask>(`${this.namespace}/checklists/:id/items/:itemId`, body, {
			urlParams: { id, itemId },
		});
	}

	/**
	 * Delete checklist item
	 * @param id checklist id
	 * @param itemId checklist item id
	 * @returns checklist item entity
	 */
	deleteChecklistItem(id: number, itemId: number) {
		return this.httpClient.client.delete<ITask>(`${this.namespace}/checklists/:id/items/:itemId`, {
			urlParams: { id, itemId },
		});
	}
}
