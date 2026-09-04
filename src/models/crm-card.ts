/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEntityData } from './crm-entities';
import { IMeta } from './response';

export type EntityCardTimelineType =
	| 'note'
	| 'task'
	| 'call'
	| 'regularTask'
	| 'document'
	| 'file'
	| 'chat'
	| 'email'
	| 'paymentForEntity'
	| 'payment';

export interface IEntityCardTimelineLinks {
	first?: string | null;
	last?: string | null;
	prev?: string | null;
	next?: string | null;
}

export interface IEntityCardTimelineSource<T = any> {
	data: T[];
	meta?: IMeta;
	links?: IEntityCardTimelineLinks;
}

export interface IEntityCardResponse {
	entity: IEntityData;
	timeline: Partial<Record<EntityCardTimelineType, IEntityCardTimelineSource>>;
}
