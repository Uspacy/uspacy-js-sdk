export interface ICalendarsAccount {
	id: number;
	active: boolean;
	status: ECalendarAccountStatuses;
	email: string;
	provider: string;
	title: string;
	timezone: string;
	sync_types: string;
	activity_type: string;
	last_sync_at: string;
	direction: string;
	selected: boolean;
	description: string;
	private_event: boolean;
	remote_calendar_id: string;
	picture: string;
}

export interface ICalendarsAccounts {
	data: ICalendarsAccount[];
}

export interface ICalendar {
	title: string;
	description: string;
	remote_calendar_id: string;
	role: string;
	timeZone: string;
}

export interface IAfterGoogleOauthResponse {
	domain: string;
	is_open_auth_calendar_drawer: boolean;
}

export interface ICalendarsSuccessResponse {
	status: boolean;
	message: string;
}

export enum ECalendarDirectionType {
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

export enum ECalendarAccountStatuses {
	RUN = 'run',
	STARTED = 'started',
	STOPPED = 'stopped',
}
