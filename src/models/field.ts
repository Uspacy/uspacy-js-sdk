export type FieldTypes =
	| 'string'
	| 'textarea'
	| 'integer'
	| 'list'
	| 'datetime'
	| 'money'
	| 'label'
	| 'phone'
	| 'email'
	| 'social'
	| 'link'
	| 'boolean'
	| 'user_id'
	| 'photo'
	| 'file'
	| 'address'
	| 'legal_details'
	| 'entity_reference'
	| 'utm'
	| 'customLink'
	| 'dateCheap'
	| 'stage'
	| 'status'
	| 'float'
	| 'reason'
	| 'productTitle'
	| 'productPrice'
	| 'productRemind'
	| 'productArticle'
	| 'productType'
	| 'productCategory'
	| 'productAvailability'
	| 'productComment'
	| 'productLink'
	| 'productGallery'
	| 'productUnit'
	| 'productTax'
	| 'productRemainder'
	// call field types
	| 'call_type'
	| 'call_status'
	| 'call_date'
	| 'call_record'
	| 'call_entity_reference'
	| 'call_phone';

export interface IField {
	name: string;
	code: string;
	required: boolean;
	editable: boolean;
	show: boolean;
	hidden: boolean;
	multiple: boolean;
	type: FieldTypes;
	field_section_id?: string;
	sort?: string | number;
	default_value?: string;
	values?: IFieldValue[];
	system_field: boolean;
	entity_reference_id?: number;
	base_field?: boolean;
	tooltip?: string;
}
export interface IFieldCreate {
	name: string;
	code: string;
	required: boolean;
	editable: boolean;
	show: boolean;
	hidden: boolean;
	multiple: boolean;
	type: FieldTypes;
	field_section_id: number;
	sort?: number;
	default_value?: string;
	values?: IFieldValue[];
	entity_reference_id?: number;
}

export interface IFieldValue {
	title: string;
	value: string;
	color: string;
	sort: number;
	selected: boolean;
}
export interface IFields {
	data: IField[];
}

export interface IFieldForSetting extends IField {
	system_field: boolean;
}
