import { IMeta } from './response';
import { ConditionType, IFilterState } from './workflows';

export interface IActionEntity {
	id: number;
	action: string;
	body?: string;
	entity?: string;
}

export interface IConditionEntity {
	id: number;
	field: string;
	type: string;
	value?: string | number[] | string[];
	logic: string;
	condition_type?: ConditionType;
	filter_state?: IFilterState;
}

export interface ITriggerEntity {
	id: number;
	entity: string;
	action: string;
}

export interface IAutomation {
	actions: IActionEntity[];
	active: boolean;
	conditions: IConditionEntity[];
	created_at: string;
	description: string;
	id: number;
	portal_id: number;
	portal: string;
	title: string;
	trigger: ITriggerEntity[];
	updated_at: number;
}

export interface IAutomationsResponse {
	meta: IMeta;
	data: IAutomation[];
}
