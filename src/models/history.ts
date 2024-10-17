import { IMeta } from './response';

export interface IChangedValue {
	value: string;
	display_value: string;
}

export interface IChangesItem {
	field_id: string;
	action: string;
	from: IChangedValue;
	to: IChangedValue;
}

export type Action = 'create' | 'update' | 'delete';

export interface IHistoryRequest {
	service: string;
	entityTableName: string;
	id: string;
	page?: string;
	list?: string;
	action?: Action;
}

export interface IHistoryResponse {
	data: IHistoryChange[];
	meta: IMeta;
}

export interface IHistoryChange {
	changed_by: string;
	changed_at: string;
	items: IChangesItem[];
}
