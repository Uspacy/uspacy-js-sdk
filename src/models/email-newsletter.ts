export enum ENewsletterStatus {
	UNPLANNED = 'unplanned',
	PLANNED = 'planned',
	SENDING = 'sending',
	SENT = 'sent',
}

export interface INewsletterProgress {
	count: number;
	percent: number;
}

export interface INewsletterPreset {
	url: string;
	uuid: string[];
}

export interface INewsletterStatistics {
	unique_opens: number;
	total_opens: number;
	unique_clicks: number;
	total_clicks: number;
	delivered: number;
	not_delivered: number;
	unsubscribed: number;
	spam: number;
}

export interface IEmailNewsletter {
	id: number;
	title: string;
	status: ENewsletterStatus;
	total_recipients: number;
	created_by: number;
	sender_id: number;
	next_run: number;
	date_start: string;
	hour_start: number;
	timezone: string;
	topic: string;
	opening_letters: boolean;
	follow_link: boolean;
	notification: boolean;
	body: string;
	created_at: number;
	presets: INewsletterPreset;
	style?: string;
	sent?: INewsletterProgress;
	read?: INewsletterProgress;
	follow_the_link?: INewsletterProgress;
	statistics?: INewsletterStatistics;
}

export interface INewsletterRecipient {
	id: number;
	email: string;
	contact_id: number;
	name: string;
	title: string;
	delivered: number;
	last_event_date: number;
}

export interface IRecipientsCountsBySegments {
	[key: string]: number;
}

export interface IEmailNewslettersCredits {
	credits: number;
}
