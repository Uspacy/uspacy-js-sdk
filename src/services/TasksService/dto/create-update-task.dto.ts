import { IFile } from '../../../models/files';
import { IGroup } from '../../../models/groups';
import { ITask, taskType } from '../../../models/tasks';

export interface ITaskValues {
	id?: string;
	title?: string;
	deadline?: number;
	responsibleId?: string;
	accomplicesIds?: string[];
	auditorsIds?: string[];
	userIds?: string[];
	body?: string;
	kanbanStageId?: string;
	priority?: string;
	acceptResult?: boolean;
	requiredResult?: boolean;
	groupId?: string;
	parentId?: number;
	setterId?: string | number;
	fileIds?: number[];
	files?: IFile[];
	status?: string;
	timeEstimate?: number;
	timeTracking?: boolean;
	group?: IGroup;
	parentTask?: ITask;
	fixed?: boolean;
	timezoneOffset?: number;
	deadlineDay?: number;
	deadlineHour?: number;
	template?: boolean;
	taskType?: taskType;
	delegation?: boolean;
	scheduler?: {
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
		timezoneOffset?: number;
	};
	crmEntities?: {
		[key: string]: {
			id: number;
			title: string;
		}[];
	};
}
