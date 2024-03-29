export interface IProductCategory {
	id: number;
	parent_id: number;
	name: string;
	is_active?: number;
	child_categories?: IProductCategory[];
}

export interface IProductCategories {
	data: {
		id: number;
		parent_id: number;
		name: string;
		is_active?: number;

		child_categories?: IProductCategory[];
	}[];
}
