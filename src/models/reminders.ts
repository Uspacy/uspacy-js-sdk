export interface IReminder {
	id?: string;
	time_before?: number;
	date_start?: string;
	hour_start?: number;
	timezone_offset?: number;
	scheduled_at?: number;
	letter: boolean;
	notification: boolean;
}
