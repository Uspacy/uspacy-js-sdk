import { IFilterRegularTasks, IFilterTasks } from './tasks';

export interface IFilterField {
	id: number;
	title: string;
	checked: boolean;
}

export interface IFilterPreset {
	id: number;
	title: string;
	filters: IFilterTasks | IFilterRegularTasks;
	pinned: boolean;
	filterFields: IFilterField[];
}
