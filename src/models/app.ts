export interface IApp {
	id: number;
	name: string;
	code: string;
	short_description: string;
	description: string | null;
	instruction: string | null;
	tech_info: string | null;
	data_security: string | null;
	logo: string;
	active: boolean;
	paid: boolean;
	installed: boolean;
	price: null | boolean | number;
	developer_name: string;
	developer_link: string;
	integration_token: string;
}

export interface IAppsFilter {
	page: number;
	list: number;
	categories?: string[];
	q?: string;
	[key: `sort_by[${string}]`]: 'asc' | 'desc';
	is_local?: boolean;
	is_installed?: boolean;
	installs_count_range?: string[];
}
