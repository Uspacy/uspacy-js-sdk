export interface IFilterField {
	id: number;
	title: string;
	sort: number;
	checked: boolean;
	fast: boolean;
}

export interface IFilterPreset<F> {
	// This field need for migrate old presets from indexedDB.
	id?: string;
	title: string;
	type: string;
	// ! TODO: refactor this fields
	filters: F;
	// This is necessary to compare the current filters and the filters in the preset itself.
	currentFilters: F;
	current: boolean;
	pinned: boolean;
	default: boolean;
	// ! TODO: refactor this fields
	filterFields: IFilterField[];
	currentFilterFields: IFilterField[];
}
