export interface ITrashFilter {
	page: number;
	list: number;
	q: string;
	entity: string;
	owner: number[];
	deleted_by: number[];
	created_at?: number[][];
	deleted_at?: number[][];
	time_label_deleted_at: string[];
	time_label_created_at: string[];
	certainDateOrPeriod_created_at: number[];
	certainDateOrPeriod_deleted_at: number[];
	openCalendar: boolean;
	sortModel?: { [key: string]: string }[];
}
