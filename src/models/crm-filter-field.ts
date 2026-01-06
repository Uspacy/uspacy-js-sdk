import { IFilter } from './crm-filters';

export interface IFilterField {
	id: number;
	title: string;
	code: string;
	sort: number;
	checked: boolean;
	fast: boolean;
}

export interface IFilterPreset {
	id: number;
	title: string;
	filters: IFilter;
	smartFilters?: IFilter;
	pinned: boolean;
	default: boolean;
	current: boolean;
	soon?: boolean;
	shadow?: boolean;
	filterFields: IFilterField[];
	sort?: number;
}

export interface IFiltersPreset {
	isNewPreset: boolean;
	currentPreset: IFilterPreset;
	standardPreset: IFilterPreset;
	filterPresets: IFilterPreset[];
}

export interface IFilterPresetsData {
	data: {
		presets: IFilterPreset[];
		filterFields: IFilterField[];
		filters: IFilter;
		smartFilters?: IFilter;
	};
}
