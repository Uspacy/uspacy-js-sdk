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
	table_name: string;
	type: string;
	sort: number;
	kanban?: boolean;
	for_all_users?: boolean;
	display_in_menu?: boolean;
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
