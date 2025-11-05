/* eslint-disable @typescript-eslint/no-explicit-any */

export type FilterCondition = 'and' | 'or';
export type FilterOperator =
	| 'is'
	| 'eq'
	| 'not_eq'
	| 'like'
	| 'not_like'
	| 'gte-lte'
	| 'gt-lt'
	| 'gte-lt'
	| 'gt-lte'
	| 'gte'
	| 'lte'
	| 'gt'
	| 'lt'
	| 'in'
	| 'startswith'
	| 'endswith'
	| 'exist'
	| 'empty';

export interface ISmartFiltersItem {
	field: string;
	operator: FilterOperator;
	currencies?: string[];
	values: any;
}

export interface ISmartFilters {
	condition: FilterCondition;
	filters?: ISmartFiltersItem[];
	groups?: ISmartFilters[];
}
