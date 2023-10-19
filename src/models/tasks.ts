import { IComment } from './comment';
import { IFile } from './files';
import { ITaskTimerList } from './timer';

export interface ITask {
	id: string;
	parentId: null | number;
	title: string;
	deadline: number;
	closedDate: number;
	createdBy: string;
	closedBy: string;
	createdDate: number;
	responsibleId: string;
	accomplicesIds: string[];
	auditorsIds: string[];
	body: string;
	status: string;
	kanbanStageId: string;
	priority: string;
	acceptResult: boolean;
	requiredResult: boolean;
	resultCommentId: string;
	fixed: boolean;
	archive: boolean;
	departmentId: string;
	groupId: string;
	setterId: string | number;
	comments: IComment[];
	files: IFile[];
	fileIds: number[];
	timeEstimate: number;
	timeTracking: boolean;
	elapsedTimes?: ITaskTimerList;
	template?: boolean;
	templateId?: number;
	scheduler?: {
		activationLimit?: boolean;
		taskId?: number;
		active?: boolean;
		period?: 'day' | 'week' | 'month' | 'year';
		every?: number;
		dayOfWeek?: number;
		dayOfMonth?: null;
		weekOfMonth?: number;
		dateStart?: string;
		dateStop?: number;
		hourStart?: number;
		deadlineDay?: number;
		deadlineHour?: number;
		iteration?: number;
		nextRun?: number;
		currentIteration?: number;
		timezoneOffset?: number;
		createdAt?: string;
		updatedAt?: string;
	};
}

export interface IMeta {
	currentPage: number;
	from: number;
	lastPage: number;
	perPage: number;
	to: number;
	total: number;
}

export interface ITasks {
	data: ITask[];
	aborted: boolean;
	meta: IMeta;
}

export interface IFilterTasks {
	total?: number;
	page?: number;
	perPage?: number;
	status?: string[];
	priority?: string[];
	time_label?: string[];
	certainDateOrPeriod?: number[];
	createdBy?: number[];
	responsible?: number[];
	accomplices?: number[];
	auditors?: number[];
	deadline?: number[][];
	openCalendar?: boolean;
	search?: string;
}

export interface IFilterRegularTasks {
	total?: number;
	page?: number;
	perPage?: number;
	status?: string[];
	priority?: string[];
	time_label?: string[];
	certainDateOrPeriod?: number[];
	createdBy?: number[];
	responsible?: number[];
	accomplices?: number[];
	auditors?: number[];
	deadline?: number[][];
	openCalendar?: boolean;
	search?: string;
}

export interface ITasksParams {
	status?: string[];
	priority?: string[];
	setter_id?: number[];
	responsible_id?: number[];
	accomplices?: number[];
	auditors?: number[];
	deadline?: number[][];
	search?: string;
	q?: string;
	groupId?: number;
	page?: number;
	list?: number;
	template?: 1;
}
