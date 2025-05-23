import { IFormField } from './forms';
import { IUser } from './user';

export interface IMeetTime {
	id: string;
	startTime: string;
	endTime: string;
}

export interface IMeetHour {
	active: boolean;
	day: string;
	id: string;
	times: IMeetTime[];
}

export interface ISpecialDay {
	date: number;
	disabled: boolean;
	id: string;
	times: IMeetTime[];
}

export interface ICustomTime {
	hour: number;
	minute: number;
}

export enum ECreateEntity {
	activity = 'activity',
	leadAndActivity = 'leadAndActivity',
}

export interface IBooking {
	id?: string;
	active?: boolean;
	created_at?: number;
	updated_at?: number;
	entryPoint?: string;
	portal?: string;
	userId?: number;
	general: {
		name: string;
		description: string;
		duration: {
			value: string | number;
			customTime: ICustomTime | null;
		};
		coffeeBreak: {
			value: string | number;
			customTime: ICustomTime | null;
		};
		timezone: string;
		emailReminder: {
			value: string | number;
			customTime: ICustomTime | null;
		};
		calendarReminder: {
			value: string | number;
			customTime: ICustomTime | null;
		};
		type: 'task' | 'call' | 'meeting' | 'chat' | 'email';
		participants: IUser['id'][];
		showPicture: boolean;
		canEditOthers: boolean;
		responsible: IUser;
	};
	userData: {
		formName: string;
		entity: ECreateEntity;
		source: string;
		fields: IFormField[];
	};
	meetHours: {
		active: boolean;
		values: IMeetHour[];
	};
	additionalRestrictions: {
		specialDays: ISpecialDay[];
		daysBeforeEvent: {
			active: boolean;
			value: number;
		};
		hoursBeforeEvent: {
			active: boolean;
			value: number;
		};
		maxMeetingsPerDay: {
			active: boolean;
			value: number;
			considerEventsInSpace: boolean;
		};
	};
}
