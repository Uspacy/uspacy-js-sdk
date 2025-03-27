import { EEventsValues, EServicesAccountDirectionType } from '../../models/oauthIntegrations';

export interface ICalendarSettings {
	remote_calendar_id: string;
	direction: EServicesAccountDirectionType;
	time_zone?: string;
	sync_types?: EEventsValues[];
	private_event?: boolean;
	activity_type?: EEventsValues;
}

export interface ISyncSettings {
	remote_calendar_id: string;
	from_date: number;
	to_date: number;
}
