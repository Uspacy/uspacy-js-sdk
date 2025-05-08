export interface IProductCategory {
	id: number;
	parent_id: number;
	name: string;
	sort: number;
	is_active?: number;
	collapsed?: boolean;
	child_categories?: IProductCategory[];
}

export interface IProductCategories {
	data: IProductCategory[];
}
