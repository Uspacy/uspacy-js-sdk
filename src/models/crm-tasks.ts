import { IFile } from '../models/files';
import { IEntityData, IMeta } from './crm-entities';
import { INotify } from './notify';
import { IReminder } from './reminders';

export interface ITasks {
	data: ITask[];
	meta: IMeta;
	aborted: boolean;
}
interface IEntityInfo {
	id: number;
	title: string;
	owner: number;
	source: string;
	avatar?: string;
	noAccess?: boolean;
}

export interface ITask {
	id: number;
	created_by: number;
	created_at: number;
	updated_at: number;
	first_closed_at: number;
	title: string;
	type: 'task' | 'call' | 'meeting' | 'chat' | 'email';
	status: 'planned' | 'done' | 'cancelled';
	priority: 'low' | 'notHigh' | 'neutral' | 'high' | 'veryHigh';
	description: string;
	start_time: number;
	end_time: number;
	closed_at: number;
	responsible_id: number;
	company_id: number;
	participants: number[];
	crm_entities: {
		contacts: IEntityInfo[];
		deals: IEntityInfo[];
		leads: IEntityInfo[];
		companies: IEntityInfo[];
		[key: string]: IEntityInfo[];
	};
	entity?: IEntityData | [];
	noAccess?: boolean;
	mentioned?: INotify;
	calendar_provider?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	entities?: any;
	file_ids?: number[];
	files?: IFile[];
	reminders?: IReminder[];
}

export interface ICall extends ITask {
	incomingPhone: string;
	outgoingPhone: string;
}
