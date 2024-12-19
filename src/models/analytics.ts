import { IMeta } from './response';

export type MoneyFilterType = { from?: number; to?: number; currency?: string };
export type DateFilterType = {
	namePeriods: string[];
	certainPeriod: number[];
};

export interface IAnalyticReportFilter {
	title: string;
	page: number;
	list: number;
	owner_id: number[];
	entity_table_name: string[];
}
export type ChartVariantType = 'column' | 'bar' | 'area' | 'line_straight' | 'line_smooth' | 'pie' | 'numeric';
export type MetricType = 'count' | 'amount_of_the_deal';
export type DayInterval = 'day' | 'month' | 'year';

export interface IAnalyticReport {
	id: string;
	title: string;
	description: string;
	chart_type: ChartVariantType | 'donut';
	entity_table_name: string;
	panel_ids?: number[];
	created_at: number;
	owner_id: number;
	filter: {
		logical_operator: 'AND' | 'OR';
		main: {
			field_code: string;
			value: string[] | number[] | boolean[] | MoneyFilterType | DateFilterType;
		}[];
		group_by: string;
		view_by: {
			value: string;
			timeframe: DayInterval;
		};
		measure_for: MetricType;
		additional: {
			is_view_percent: boolean;
			is_view_value: boolean;
		};
	};
}

export interface IAnalyticReportList {
	meta: IMeta;
	data: IAnalyticReport[];
}
