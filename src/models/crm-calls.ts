import { IEntityData, IMeta } from './crm-entities';

export interface ICalls {
	data: ICall[];
	meta: IMeta;
}

export interface ICall {
	id: number;
	task_id: number;
	contact_id: number;
	company_id: number;
	deal_id: number;
	lead_id: number;
	tasks: IEntityData[];
	contacts: IEntityData[];
	companies: IEntityData[];
	deals: IEntityData[];
	leads: IEntityData[];
	entity_table: string;
	subject: string;
	call_type: string;
	ended_call_status: string;
	from: string;
	to: string;
	begin_time: number;
	end_time: number;
	duration: number;
	call_record_link: string;
	call_record_file: string;
	note: string;
	integration_code: string;
	external_id: number;
	tmp_id: number;
	employees: number[];
}

export enum EButtonType {
	HANGUP = 'HANGUP',
	PAUSE = 'PAUSE',
	RESUME = 'RESUME',
}

export interface ICallEvent {
	call_type: 'incoming' | 'outgoing';
	from: string;
	to: string;
	call_event_id: number;
	auth_user_id: number;
	integration_code: string;
	buttons: {
		url: string;
		data: { id: 1041160600; type: EButtonType };
	}[];

	// mock
	time?: string;
	status?: string;
	note?: string;
}
