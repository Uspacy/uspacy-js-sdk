export interface ILeadFilters {
	kanban_status?: string[];
	stages?: string[];
	source?: string[];
	time_label?: string[];
	certainDateOrPeriod?: number[];
	period?: number[][];
	owner?: number[];
	openDatePicker?: boolean;
	search?: string;
	page?: number;
	perPage?: number;
	table_fields?: string[];
}

export interface IDealFilters {
	kanban_status?: string[];
	stages?: string[];
	time_label?: string[];
	certainDateOrPeriod?: number[];
	period?: number[][];
	owner?: number[];
	tasks_label?: string[];
	tasks?: number[][];
	openDatePicker?: boolean;
	search?: string;
	page: number;
	perPage?: number;
	select?: number;
	table_fields?: string[];
}

export interface IProductFilters {
	availability?: string[];
	type?: string[];
	currency?: string;
	price_from?: number;
	price_to?: number;
	balance_from?: number;
	balance_to?: number;
	is_active?: string[];
	openDatePicker?: boolean;
	search?: string;
	page: number;
	perPage?: number;
	select?: number;
}

export interface ICompanyFilters {
	company_label?: string[];
	source?: string[];
	time_label?: string[];
	certainDateOrPeriod?: number[];
	period?: number[][];
	owner?: number[];
	deals?: string[];
	openDatePicker?: boolean;
	search?: string;
	page: number;
	perPage?: number;
	table_fields?: string[];
}

export interface IContactFilters {
	contact_label?: string[];
	source?: string[];
	time_label?: string[];
	certainDateOrPeriod?: number[];
	period?: number[][];
	owner?: number[];
	deals?: string[];
	openDatePicker?: boolean;
	search?: string;
	page: number;
	perPage?: number;
	table_fields?: string[];
}
export interface ITaskFilters {
	page: number;
	perPage?: number;
	status?: string[];
	task_type?: string[];
	responsible_id?: number[];
	time_label?: string[];
	certainDateOrPeriod?: number[];
	period?: number[][];
	participants?: number[];
	openDatePicker?: boolean;
	search?: string;
}

export interface ICallFilters {
	page: number;
	perPage?: number;
	responsible_id?: number[];
	type?: string[];
	status?: string[];
	durationPeriod?: number[][];
	duration?: string[];
	interval?: number[];
	time_label?: string[];
	certainDateOrPeriod?: number[];
	period?: number[][];
	openDatePicker?: boolean;
	search?: string;
}

export interface IEntityFilters {
	created_at?: string[];
	updated_at?: string[];
	created_at_period: number[][];
	updated_at_period: number[][];
	owner?: number[];
	created_by?: number[];
	changed_by?: number[];
	time_label: string[];
	certainDateOrPeriod: number[];
	search?: string;
	page: number;
	perPage?: number;
	select?: number;
	entityCode: string;
	stages?: string[];
	table_fields?: string[];
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
