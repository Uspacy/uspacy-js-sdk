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

export interface IEmailNewsletter {
	id: number;
	title: string;
	status: ENewsletterStatus;
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
}
