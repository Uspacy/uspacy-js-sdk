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
