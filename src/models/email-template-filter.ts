export interface IEmailTemplateFilter {
	page: number;
	list: number;
	sections: string[];
	created_by: number[];
	user_ids: number[];
	created_at: number[];
	updated_at: number[];
	q: string;
	title: string;
	time_label_created_at: string[];
	time_label_updated_at: string[];
	certainDateOrPeriod: number[];
	certainDateOrPeriod_created_at: number[];
	certainDateOrPeriod_updated_at: number[];
	openCalendar: boolean;
}
