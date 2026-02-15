export interface IIntegrationCalendar {
	id: number;
	title: string;
	description: string;
	direction: EServicesAccountDirectionType;
	timezone: string;
	last_sync_at: string;
	selected: boolean;
	sync_types: EEventsValues[];
	activity_type: EEventsValues;
	remote_calendar_id: string;
	integration_id: number;
	private_event: boolean;
}

export interface Integration {
	id: number;
	type: oauthType;
	active: boolean;
	status: EServicesAccountStatuses;
	account_id: number;
	created_at: string;
	updated_at: string;
	calendars: IIntegrationCalendar[];
}

export interface IOAuthServicesAccount {
	id: number;
	user_id: number;
	provider: oauthProvider;
	name: string;
	email: string;
	picture: string;
	integrations: Integration[];
	created_at: string;
	updated_at: string;
}

export interface IOAuthServicesAccounts {
	data: IOAuthServicesAccount[];
}

export interface ICalendar {
	title: string;
	description: string;
	remote_calendar_id: string;
	role: ECalendarRoles;
	timeZone: string;
}

export interface ISaveAccountResponse {
	data: {
		id: number;
		title: string;
		description: string;
		direction: EServicesAccountDirectionType;
		timezone: string;
		last_sync_at: string;
		selected: boolean;
		sync_types: EEventsValues[];
		activity_type: EEventsValues;
		remote_calendar_id: string;
		integration_id: number;
		integration: {
			id: number;
			type: oauthType;
			active: boolean;
			status: EServicesAccountStatuses;
			account_id: number;
			account: {
				id: number;
				user_id: number;
				provider: oauthProvider;
				name: string;
				email: string;
				picture: string;
				created_at: string;
				updated_at: string;
			};
			created_at: string;
			updated_at: string;
		};
	};
}

export interface IAfterOauthResponse {
	domain: string;
	provider: string;
	integration: string;
	message?: string;
	payload?: {
		back_redirect_url: string;
	};
}

export interface ICalendarsSuccessResponse {
	status: boolean;
	message: string;
}

export enum EServicesAccountDirectionType {
	DOUBLE_SIDED = 'double_sided',
	PROVIDER_ACTIVITY = 'provider_activity',
	ACTIVITY_PROVIDER = 'activity_provider',
}

export enum EEventsValues {
	TASK = 'task',
	CALL = 'call',
	MEETING = 'meeting',
	CHAT = 'chat',
	EMAIL = 'email',
}

export enum EServicesAccountStatuses {
	RUN = 'run',
	STARTED = 'started',
	STOPPED = 'stopped',
}

export enum ECalendarRoles {
	OWNER = 'owner',
	WRITER = 'writer',
	READER = 'reader',
}

export type oauthProvider = 'google' | 'zoom' | 'microsoft';

export type oauthType = 'meeting' | 'calendar' | 'email';
