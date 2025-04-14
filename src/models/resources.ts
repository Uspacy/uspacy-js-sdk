import { IFormField, IFormOther, IPredefinedField } from './forms';

export type ResourceType = 'form' | 'widget' | 'calendar';

export interface ResourceConfig {
	crmEntity: string;
	fields?: IFormField[];
	other?: IFormOther[];
	predefinedFields?: IPredefinedField[];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

export interface IResource {
	name: string;
	type: ResourceType;
	active?: boolean;
	config: ResourceConfig;
}
