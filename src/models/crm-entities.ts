import { ICardBlock } from './crm-card-blocks';
import { IFunnel } from './crm-funnel';
import { IFields } from './field';

export interface IMeta {
	total: number;
	from: number;
	list: number;
	per_page: number;
	last_page?: number;
}

export interface IEntityMainData {
	id?: number;
	title: string;
	title_singular: string;
	table_name: string;
	type: string;
	sort: number;
	kanban?: boolean;
	for_all_users?: boolean;
	display_in_menu?: boolean;
	funnels?: null | IFunnel[];
	fields?: IFields;
	entityItems?: IEntity;
	items?: IEntity | null;
	created_at?: number;
	updated_at?: number;
	created_by?: number;
	changed_by?: number;
	activity_support?: boolean;
	task_support?: boolean;
	cardBlocks?: ICardBlock[];
}

export interface IEntityMain {
	data: IEntityMainData[];
	meta: IMeta;
}

export interface IEntityData {
	id: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

export interface IEntity {
	data: IEntityData[];
	meta: IMeta;
	aborted: boolean;
}
