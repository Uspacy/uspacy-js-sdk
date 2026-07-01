import { IMeta } from './response';
import { ISmartFilters } from './smart-filters';

export type MoneyFilterType = { from?: number; to?: number; currency?: string };
export type DateFilterType = {
	namePeriods: string[];
	certainPeriod: number[];
};

export interface IAnalyticReportFilter {
	title?: string;
	page: number;
	list: number;
	owner_id?: number[];
	entity_table_name?: string[];
	id?: string[];
}
export type ChartVariantType = 'column' | 'bar' | 'area' | 'line_straight' | 'line_smooth' | 'pie' | 'numeric' | 'conversion' | 'funnel';
export type MetricType = 'count' | 'amount_of_the_deal';
export type DayInterval = 'day' | 'month' | 'year';

export interface ITableColumnSettings {
	column_visibility: Record<string, boolean>;
	column_ordering: string[];
	column_sizes: Record<string, number>;
	sort_model?: Record<string, string>[];
}

export interface IAnalyticReport {
	id: string;
	title: string;
	description: string;
	chart_type: ChartVariantType | 'donut';
	entity_table_name: string;
	dashboards?: string[];
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
		measure_for: string;
		additional: {
			measure_for_currency?: string;
			measure_for_aggregation?: 'sum' | 'avg';
			is_view_percent: boolean;
			is_view_value: boolean;
			table_settings?: Record<string, ITableColumnSettings>;
			excluded_stage_ids?: number[];
		};
	};
}

export interface IFunnelConversionStage {
	stage_id: number;
	count: number;
	skipped: number | null;
	avg_time_seconds: number;
	conversion_from_previous_percent: number;
	cumulative_conversion_percent: number;
	stage_title?: string;
	stage_code?: string;
	color?: string;
	sort?: number;
}

export interface IFunnelConversionParams {
	entity_type: string;
	funnel_id: number;
	excluded_stage_ids: number[];
	filters: ISmartFilters;
}

export interface IAnalyticReportList {
	meta: IMeta;
	data: IAnalyticReport[];
}

export interface IDashboard {
	id?: string;
	title: string;
	access_settings: {
		owner: number;
		editors?: number[];
		viewers?: number[];
	};
	layout?: {
		i?: number;
		x?: number;
		y?: number;
		w?: number;
		h?: number;
		report_id: string;
		report?: IAnalyticReport;
		minW?: number;
		maxW?: number;
		minH?: number;
		maxH?: number;
	}[];
}
