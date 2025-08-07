export enum ENewsletterRecipientsEvent {
	DELIVERED = 'delivered',
	NOT_DELIVERED = 'not_delivered',
	UNSUBSCRIBED = 'unsubscribed',
	OPEN = 'open',
	CLICK = 'click',
	SPAM = 'spam',
}

export interface IMarketingFilter {
	page: number;
	list: number;
	sections: string[];
	status: string[];
	presets: string[];
	created_by: number[];
	user_ids: number[];
	created_at: number[];
	updated_at: number[];
	next_run: number[];
	q: string;
	title: string;
	time_label_created_at: string[];
	time_label_updated_at: string[];
	time_label_next_run: string[];
	certainDateOrPeriod: number[];
	certainDateOrPeriod_created_at: number[];
	certainDateOrPeriod_updated_at: number[];
	certainDateOrPeriod_next_run: number[];
	openCalendar: boolean;
}

export interface INewsletterRecipientsFilter {
	page: number;
	list: number;
	event: ENewsletterRecipientsEvent;
	sort_by?: {
		[key: string]: string;
	};
}
