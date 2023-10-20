export interface IElapsedTime {
	id: number;
	dateStart: number;
	dateStop: number;
	dateCreate: number;
	dateUpdate: number;
	taskId: number;
	userId: number;
	seconds: number;
	source: 'manual' | 'auto';
	comment: string;
}

export interface ITaskTimerList {
	totalSeconds: number;
	myTime: number;
	elapsedTimes: IElapsedTime[];
}

export interface ITimerPayload {
	date_start?: number;
	date_stop?: number;
	date_create?: number;
	comment?: string;
}

export interface ITimerRealTime {
	taskId: number;
	title: string;
	timeEstimate: number;
	totalSeconds: number;
	timerStartedAt: number;
}
