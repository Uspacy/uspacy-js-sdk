export interface IWorkday {
	name: string;
	priority: number;
	avatar?: string;
	type: string;
	message: string;
	deadline: number;
	isEmpty?: boolean;
	entity_id: number;
	guid: string;
}

export interface IInsight {
	title: string;
	text: string;
}

export interface ICounters {
	tasks: number;
	deals: number;
	leads: number;
	activities: number;
}

export interface IHomeGeneralData {
	title: string;
	counters: ICounters;
	workday: IWorkday[];
	overdue: IWorkday[];
	insights: IInsight[];
}
