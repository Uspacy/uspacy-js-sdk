import { IMeta } from './crm-entities';

export interface IRequisitesResponse {
	data: IRequisite[];
	meta: IMeta[];
}

export interface IRequisite {
	fields: {
		list: [];
		values: {};
	};
	region: {
		id: number;
		code: string;
		name: string;
		image: number;
	};
	is_basic: boolean;
	name: string;
	id: number;
	payer_pdv: boolean;
	seal_picture: number;
	sign_picture: number;
	template_id: number;
	template_name: string;
	bank_requisites: IBankRequisite[];
}

export type IRequisitePartial = Partial<IRequisite>;
export type IRequisiteUpdate = Omit<IRequisitePartial, 'fields'> & { fields?: object };

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

export interface ICountryTemplates {
	code: string;
	image: number;
	name: string;
	templates: ITemplate[];
}

export type ITemplatePartial = Partial<ITemplate>;
export type ITemplateUpdate = Omit<ITemplatePartial, 'fields'> & { fields?: object; region_id: number };

export interface ITemplateResponse {
	data: ITemplate[];
	meta: IMeta[];
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

export interface IBankRequisite {
	created_by: number;
	fields: {
		list: IBankRequisiteField[];
		values: {
			[key: string]: string;
		};
	};
	id: number;
	is_basic: boolean;
	name: string;
	requisite_id: number;
	updated_by: number;
}
