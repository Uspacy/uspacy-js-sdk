interface IBaseFilter {
	search?: string;
	page?: number;
	perPage?: number;
	boolean_operator?: string;
	openDatePicker?: boolean;
	kanban_reason_id?: number[];
	status?: string[];
	table_fields?: string[];
	task_type?: string[];
	entityCode?: string;
	sortModel?: { [key: string]: string }[];
}

export interface ILeadFilters extends IBaseFilter {
	kanban_status?: string[];
	stages?: string[];
	source?: string[];
	time_label?: string[];
	certainDateOrPeriod?: number[];
	period?: number[][];
	owner?: number[];
}

export interface IDealFilters extends IBaseFilter {
	kanban_status?: string[];
	stages?: string[];
	kanban_stage_id?: string[] | number[];
	time_label?: string[];
	certainDateOrPeriod?: number[];
	period?: number[][];
	owner?: number[];
	tasks_label?: string[];
	tasks?: number[][];
	select?: number;
	table_fields?: string[];
}

export interface ICompanyFilters extends IBaseFilter {
	company_label?: string[];
	source?: string[];
	time_label?: string[];
	certainDateOrPeriod?: number[];
	period?: number[][];
	owner?: number[];
	deals?: string[];
}

export interface IContactFilters extends IBaseFilter {
	contact_label?: string[];
	source?: string[];
	time_label?: string[];
	certainDateOrPeriod?: number[];
	period?: number[][];
	owner?: number[];
	deals?: string[];
}
export interface ITaskFilters extends IBaseFilter {
	status?: string[];
	responsible_id?: number[];
	time_label?: string[];
	certainDateOrPeriod?: number[];
	period?: number[][];
	participants?: number[];
	start_time?: [number[]];
}

export interface ICallFilters extends IBaseFilter {
	responsible_id?: number[];
	type?: string[];
	status?: string[];
	durationPeriod?: number[][];
	duration?: string[];
	interval?: number[];
	time_label?: string[];
	certainDateOrPeriod?: number[];
	period?: number[][];
}

export interface IProductFilters extends IBaseFilter {
	availability?: string[];
	type?: string[];
	currency?: string;
	price_from?: number;
	price_to?: number;
	balance_from?: number;
	balance_to?: number;
	is_active?: string[];
	select?: number;
}

export interface IEntityFilters extends IBaseFilter {
	created_at?: string[];
	updated_at?: string[];
	created_at_period?: number[][];
	updated_at_period?: number[][];
	owner?: number[];
	created_by?: number[];
	changed_by?: number[];
	time_label?: string[];
	certainDateOrPeriod?: number[];
	select?: number;
	entityCode?: string;
	stages?: string[];
}

export interface ICreatedAt {
	name: string;
	noLocalization: string;
	value: number[];
}

export interface IDocumentTemplateFilters {
	page?: number;
	list?: number;
	binding_entities_template?: { entity_id: number; funnels: number[] }[];
	search?: string;
	is_active?: string[];
	created_at?: string[];
	updated_at?: string[];
	createdAtCertainDateOrPeriod?: number[];
	updatedAtCertainDateOrPeriod?: number[];
	create_between?: number[][];
	update_between?: number[][];
}

export interface IDocumentTemplateFieldFilters {
	page?: number;
	list?: number;
	binding_entities?: number[];
	search?: string;
}

export type IFilter = ILeadFilters & IDealFilters & IContactFilters & ICompanyFilters & IProductFilters & IEntityFilters;
