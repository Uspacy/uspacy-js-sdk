import { IMeta } from './crm-entities';

export interface IRequisite {
	fields: {
		list: [];
		values: {};
	};
	is_basic: boolean;
	name: string;
	id: number;
	seal_picture: number;
	sign_picture: number;
	template_id: number;
	template_name: string;
	bank_requisites?: IBankRequisiteCreate[];
	references_relations?: number[];
}

export interface ITemplate {
	id: number;
	name: string;
	region: {
		id: number;
		code: string;
		name: string;
		image: number;
	};
	created_at: string;
	updated_at: string;
	created_by: number;
	updated_by: number;
	fields: [];
}

export interface ITemplateResponse {
	data: ITemplate[];
	meta: IMeta[];
}

export interface IBankRequisite {
	created_by: number;
	fields: {
		list: [];
		values: {};
	};
	id: number;
	is_basic: boolean;
	name: string;
	requisite_id: number;
	updated_by: number;
}

export interface IBankRequisiteField {
	name: string;
	type: string;
	code: string;
	default_value: string;
	is_show_preview: number;
	is_show_default: number;
	tooltip: string;
	value?: string;
	required?: boolean;
}

export interface IBankRequisiteCreate {
	id: number;
	name: string;
	is_basic: boolean;
	fields: {
		list: IBankRequisiteField[];
		values: {
			[key: string]: string;
		};
	};
	isCreate?: boolean;
	references_relations?: number[];
}

export interface IBankUpdateData {
	cardId: string;
	requisiteId: number;
	bankRequisites: IBankRequisiteCreate[];
}

export interface IBankRequisitesResponse {
	data: IBankRequisite[];
	meta: IMeta[];
}

export interface IRequisitesResponse {
	data: IRequisite[];
	meta: IMeta[];
}

export interface ICardRequisites {
	cardId: string;
	requisites: IRequisite[];
}
export interface ICardRequisite {
	cardId: string;
	requisite: IRequisite;
}

export interface IRequisiteUpdateData {
	cardId: string;
	requisite: IRequisite;
	isProfile: boolean;
}
export interface IRequisiteDeleteData {
	cardId: string;
	requisiteId: number;
}

export interface IBankDeleteData extends IRequisiteDeleteData {
	bankRequisiteId: number;
}
