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
	// This is necessary to compare the current filters and the filters in the preset itself.
	currentFilters: F;
	current: boolean;
	pinned: boolean;
	default: boolean;
	filterFields: IFilterField[];
	currentFilterFields: IFilterField[];
}
