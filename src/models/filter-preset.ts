export interface IFilterField {
	id: number;
	title: string;
	sort: number;
	checked: boolean;
	fast: boolean;
}

export interface IFilterPreset<F> {
	title: string;
	type: string;
	filters: F;
	current: boolean;
	pinned: boolean;
	default: boolean;
	filterFields: IFilterField[];
}
