/* eslint-disable @typescript-eslint/no-explicit-any */
import { IComment } from './comment';
import { ITask as IActivity } from './crm-tasks';
import { IFile } from './files';
import { IGroup } from './groups';
import { IReminder } from './reminders';
import { ISmartFilters } from './smart-filters';
import { ITaskTimerList } from './timer';

export type taskType = 'task' | 'recurring' | 'one_time';

export interface ISubTasksInfo {
	count: number;
	subtasks: Partial<ITask>[];
}

export interface IActivitiesInfo {
	count: number;
	activities: Partial<IActivity>[];
}

export interface IChecklistItem {
	id: number;
	title: string;
	done: boolean;
	sort?: number;
}

export interface IChecklist {
	id: number;
	name: string;
	items: IChecklistItem[];
	sort?: number;
}

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
	userIds: string[];
	taskType: taskType;
	body: string;
	status: string;
	kanbanStageId: string;
	groupKanbanStageId?: string;
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
	deadlineDay?: number;
	deadlineHour?: number;
	active?: boolean;
	sort?: number;
	delegation?: boolean;
	group?: IGroup;
	parentTask?: ITask;
	scheduler?: {
		activationLimit?: boolean;
		taskId?: number;
		active?: boolean;
		period?: 'day' | 'week' | 'month' | 'year';
		every?: number;
		dayOfWeek?: number;
		dayOfMonth?: number;
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
	crmEntities?: {
		[key: string]: {
			id: number;
			title: string;
		}[];
	};
	childTasks?: {
		data: ITask[];
		total: number;
	};
	quantityOfComments?: string[];
	activitiesInfo?: IActivitiesInfo;
	subtasksInfo?: ISubTasksInfo;
	checklists?: IChecklist[];
	tableName?: string;
	reminders?: IReminder[];
	[key: string]: any;
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

export interface ITasksParams {
	q?: string;
	page?: number;
	list?: number;
	boolean_operator?: string;
	openCalendar?: boolean;
	sort_by?: {
		[key: string]: 'asc' | 'desc';
	};
	filters?: ISmartFilters;
	[key: string]: any;
}
