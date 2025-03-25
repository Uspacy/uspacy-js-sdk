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

export interface IBooking {
	id?: string;
	general: {
		name: string;
		description: string;
		duration: {
			value: string | number;
			customTime: number | null;
		};
		coffeBreak: {
			value: string | number;
			customTime: number | null;
		};
		timezone: string;
		emailReminder: {
			value: string | number;
			customTime: number | null;
		};
		calendarReminder: {
			value: string | number;
			customTime: number | null;
		};
		type: 'task' | 'call' | 'meeting' | 'chat' | 'email';
		showPicture: boolean;
		canEditOthers: boolean;
	};
	userData: {
		formName: string;
		entity: 'deal' | 'leadAndDeal';
		source: string;
		// після релізу форм оновитись з мейну і задати fields: IFormField[]
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		fields: any[];
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
