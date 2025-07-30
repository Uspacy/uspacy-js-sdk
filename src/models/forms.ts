/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityType } from './entity';
import { FieldTypes, IField } from './field';

export type FormFieldCode = 'title' | 'email' | 'phone' | 'logo' | 'header' | 'subheader' | 'privacyPolicy' | 'submitButton' | (string & {});

export interface IFormField {
	fieldCode: FormFieldCode;
	type: FieldTypes;
	order?: number;
	label: string;
	hint: string;
	placeholder: string;
	field?: Partial<IField> & { entity: EntityType };
	selected?: boolean;
	required?: boolean;
	secondHintText?: string;
	multiple?: boolean;
}

export interface IFormOther {
	fieldCode: FormFieldCode;
	order?: number;
	ico?: any;
	value?: string;
	previewTitle?: string;
	selected?: boolean;
	formLogoValue?: string;
	privacyPolicySettings?: {
		value: string;
		required: boolean;
		defaultCheck: boolean;
	};
	buttonSettings?: {
		text: string;
		showIco: boolean;
		ico: string;
		background: string;
	};
}

export interface IPredefinedField {
	type: string;
	value: string | number;
}

export interface IForm {
	id?: string;
	name: string;
	active: boolean;
	config: {
		crmEntity: 'lead' | 'contact';
		predefinedFields: IPredefinedField[];
		fields: IFormField[];
		other: IFormOther[];
	};
	creared_at?: number;
	updated_at?: number;
	entryPoint?: string;
	portal?: string;
	type?: string;
	userId?: number;
}
