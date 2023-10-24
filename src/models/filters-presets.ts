import { IFilterTasks } from './tasks';

export interface IFilterField {
	id: number;
	title: string;
	sort: number;
	checked: boolean;
	fast: boolean;
}

export interface IFilterPreset {
	id: number;
	title: string;
	filters: IFilterTasks;
	pinned: boolean;
	default: boolean;
	filterFields: IFilterField[];
}
