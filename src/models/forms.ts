/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityType } from './entity';
import { FieldTypes, IField } from './field';

export type FormFieldCode =
	| 'title'
	| 'email'
	| 'phone'
	| 'logo'
	| 'header'
	| 'subheader'
	| 'privacyPolicy'
	| 'submitButton'
	| 'companyLogo'
	| 'banner'
	| 'divider'
	| (string & {});

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
}

export interface IFormOther {
	fieldCode: FormFieldCode;
	isOther?: boolean;
	order?: number;
	ico?: any;
	value?: string;
	previewTitle?: string;
	selected?: boolean;
	formLogoValue?: string;
	isOutsideSort?: boolean;
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

export interface IFormAfterSubmit {
	showMessage: boolean;
	fields: IFormOther[];
	redirectUrl: string | null;
	timeBeforeRedirect: number | null;
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
		after?: IFormAfterSubmit;
	};
	creared_at?: number;
	updated_at?: number;
	entryPoint?: string;
	portal?: string;
	type?: string;
	userId?: number;
}
