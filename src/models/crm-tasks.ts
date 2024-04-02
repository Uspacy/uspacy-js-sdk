import { IEntityData, IMeta } from './crm-entities';
import { INotify } from './notify';

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
	contacts: IEntityInfo[];
	deals: IEntityInfo[];
	leads: IEntityInfo[];
	company: IEntityInfo;
	entity?: IEntityData | [];
	noAccess?: boolean;
	mentioned?: INotify;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	entities?: any;
}

export interface ICall extends ITask {
	incomingPhone: string;
	outgoingPhone: string;
}
