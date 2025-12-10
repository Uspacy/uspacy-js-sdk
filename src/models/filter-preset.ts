import { ISmartFilters } from './smart-filters';

export interface IFilterField {
	id: number;
	title: string;
	sort: number;
	checked: boolean;
	fast: boolean;
	code?: string;
}

export interface IFilterPreset<F> {
	// This field need for migrate old presets from indexedDB.
	id?: string;
	title: string;
	type: string;
	filters?: F;
	smartFilters?: ISmartFilters;
	// This is necessary to compare the current filters and the filters in the preset itself.
	currentFilters?: F;
	currentSmartFilters?: ISmartFilters;
	current: boolean;
	pinned: boolean;
	default: boolean;
	filterFields?: IFilterField[];
	currentFilterFields?: IFilterField[];
	soon?: boolean;
	shadow?: boolean;
	sort?: number;
}

export interface IFilterPresetsData<T> {
	data: {
		presets: IFilterPreset<T>[];
		filterFields: IFilterField[];
		filters: T;
	};
}
