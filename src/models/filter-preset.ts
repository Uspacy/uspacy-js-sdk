export interface IFilterField {
	id: number;
	title: string;
	sort: number;
	checked: boolean;
	fast: boolean;
}

export interface IFilterPreset<F = unknown> {
	id: number;
	title: string;
	filters: F;
	current: boolean;
	pinned: boolean;
	default: boolean;
	filterFields: IFilterField[];
}
