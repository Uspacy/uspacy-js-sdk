import { IFilterTasks } from './tasks';

export interface IFilterField {
	id: number;
	title: string;
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
