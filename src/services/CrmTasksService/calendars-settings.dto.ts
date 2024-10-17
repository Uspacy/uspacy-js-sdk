import { ECalendarDirectionType, EEventsValues } from '../../models/calendars';

export interface ICalendarSettings {
	remote_calendar_id: string;
	direction: ECalendarDirectionType;
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
