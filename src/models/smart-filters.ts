/* eslint-disable @typescript-eslint/no-explicit-any */

export type FilterCondition = 'and' | 'or';
export type FilterTemplate = 'base';
export type FilterOperator =
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
	| 'is'
	| 'in'
	| 'startswith'
	| 'endswith'
	| 'exist'
	| 'part'
	| 'empty'
	| 'not_empty';

export interface ISmartFiltersItem {
	id?: string;
	field: string;
	operator: FilterOperator;
	operatorLabel?: string;
	currencies?: string[];
	values: any;
}

export interface ISmartFilters {
	id?: string;
	condition?: FilterCondition;
	template?: FilterTemplate;
	filters?: ISmartFiltersItem[];
	groups?: ISmartFilters[];
}
