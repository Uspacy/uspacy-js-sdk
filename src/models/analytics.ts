import { IMeta } from './response';

export type MoneyFilterType = { from: number; to: number; currency: string };
export type DateFilterType = {
	namePeriods: string[];
	certainPeriod: number[];
};

export interface IAnalyticReport {
	id: number;
	title: string;
	description: string;
	chart_type: 'column' | 'bar' | 'area' | 'line_straight' | 'line_smooth' | 'pie' | 'numeric' | 'donut';
	entity_table_name: string;
	panel_ids?: number[];
	created_at: number;
	owner_id: number;
	logical_operator: 'AND' | 'OR';
	filter: {
		main: {
			field_code: string;
			value: string[] | number[] | boolean[] | MoneyFilterType | DateFilterType;
		}[];
		group_by: string;
		view_by: {
			value: string;
			timeframe: string;
		};
		measure_for: string;
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
