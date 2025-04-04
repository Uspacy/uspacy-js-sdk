import { IMeta } from './crm-entities';
import { IFile } from './files';

export type documentsGeneratorTypes = 'documentTemplates' | 'documentTemplatesFields' | 'numerators';

export interface IDocumentTemplates {
	data: IDocumentTemplate[];
	meta: IMeta;
	total_templates_count: number;
	aborted?: boolean;
}
export interface IDocumentTemplate {
	id: number;
	name: string;
	is_active: boolean;
	file: number | File | IFile;
	code?: string;
	binding_entities: {
		entity_id: number;
		funnels: number[];
	}[];
	access: {
		departments: number[];
		users: number[];
	};
	numerator_id: number;
	created_at: string;
	updated_at: string;
	created_by: number;
	updated_by: number;
	disabled: boolean;
}

export interface IDocumentTemplateField {
	id: number;
	name: string;
	entity: string;
	symbol_code: string;
}

export interface IDocumentTemplateFields {
	data: IDocumentTemplateField[];
	meta: IMeta;
	aborted?: boolean;
}
