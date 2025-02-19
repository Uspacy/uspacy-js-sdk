import { IComment } from './comment';
import { IFile } from './files';
import { IGroup } from './groups';
import { ITaskTimerList } from './timer';

export type taskType = 'task' | 'recurring' | 'one_time';

export interface ISubTasksInfo {
	count: number;
	subtasks: {
		id: number;
		title: string;
		priority: string;
	}[];
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
	activityIds?: string[];
	quantityOfComments?: string[];
	subtasksInfo?: ISubTasksInfo;
	tableName?: string;
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
	time_label_deadline?: string[];
	time_label_closed_date?: string[];
	time_label_created_date?: string[];
	certainDateOrPeriod?: number[];
	certainDateOrPeriod_deadline?: number[];
	certainDateOrPeriod_closed_date?: number[];
	certainDateOrPeriod_created_date?: number[];
	createdBy?: number[];
	responsible?: number[];
	accomplices_ids?: number[];
	auditors_ids?: number[];
	deadline?: number[][];
	period?: string[][];
	accept_result?: boolean[];
	time_tracking?: boolean[];
	closed_by?: number[];
	closed_date?: number[][];
	created_date?: number[][];
	group_id?: number[];
	parent_id?: number[];
	openCalendar?: boolean;
	search?: string;
	sortModel?: { id: string; desc: boolean }[];
	boolean_operator?: string;
	time_label?: string[];
	accomplices?: number[];
	auditors?: number[];
	groupId?: number;
	child_list?: number;
	child_page?: number;
	kanban_fields?: string[];
	sort_by?: {
		[key: string]: 'asc' | 'desc';
	};
}

export interface ITasksParams {
	id?: string[];
	status?: string[];
	priority?: string[];
	setter_id?: number[];
	responsible_id?: number[];
	accomplices_ids?: number[];
	auditors_ids?: number[];
	deadline?: number[][];
	search?: string;
	q?: string;
	accept_result?: boolean[];
	time_tracking?: boolean[];
	closed_by?: number[];
	closed_date?: number[][];
	created_date?: number[][];
	group_id?: number[];
	parent_id?: number[];
	page?: number;
	list?: number;
	template?: boolean | number;
	boolean_operator?: string;
	use_search?: boolean;
	accomplices?: number[];
	auditors?: number[];
	groupId?: number;
	child_list?: number;
	child_page?: number;
	kanban_fields?: string[];
	sort_by?: {
		[key: string]: 'asc' | 'desc';
	};
}
