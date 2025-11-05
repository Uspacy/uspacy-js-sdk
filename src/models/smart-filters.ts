/* eslint-disable @typescript-eslint/no-explicit-any */

export type FilterCondition = 'and' | 'or';
export type FilterOperator =
	| 'is'
	| 'eq'
	| 'not_eq'
	| 'like'
	| 'not_like'
	| 'lte-gte'
	| 'gt'
	| 'gte'
	| 'lte'
	| 'startswith'
	| 'endswith'
	| 'exist'
	| 'empty';

export interface IFilterValuesWithFromTo {
	from: number | string;
	to: number | string;
}

export interface ISmartFiltersItem {
	field: string;
	operator: FilterOperator;
	values: IFilterValuesWithFromTo | any;
}

export interface IFilterGroups {
	condition: FilterCondition;
	filters?: ISmartFiltersItem[];
	groups?: IFilterGroups[];
}

export interface ISmartFilters {
	condition: FilterCondition;
	filters?: ISmartFiltersItem[];
	groups?: IFilterGroups[];
}
