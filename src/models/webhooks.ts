export interface IMeta {
	current_page: number;
	from: number;
	last_page: number;
	per_page: number;
	to: number;
	total: number;
}

export interface IEvent {
	actions: string[];
	service: string;
	table_name?: string;
	type: string;
	category?: string;
}

export interface IInput {
	id?: number;
	title: string;
	category?: string;
	service?: string;
	type?: string;
	table_name?: string;
	action?: string;
}

export interface IPermission {
	service: string;
}

export interface IWebhook {
	active: boolean;
	confirmed?: boolean;
	created_at: number;
	events: IEvent[];
	id: number;
	updated_at: number;
	url: string;
	user_id: number;
	permissions?: IPermission[];
	webhook_url?: string;
}

export interface IWebhooksResponse {
	meta: IMeta;
	data: IWebhook[];
}
