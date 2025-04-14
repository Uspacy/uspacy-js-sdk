import { IFormField, IPredefinedField } from './forms';

export type ResourceType = 'form' | 'widget' | 'calendar';

export interface ResourceConfig {
	crmEntity: string;
	fields?: IFormField[];
	predefinedFields?: IPredefinedField[];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	other?: any[];
}

export interface IResource {
	name: string;
	type: ResourceType;
	active?: boolean;
	config: ResourceConfig;
	created_at: number;
	updated_at: number;
	entryPoint: string;
	id: string;
	portal: string;
	userId: number;
}
