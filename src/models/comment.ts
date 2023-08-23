import { INotify } from './notify';

export type EntityType = 'post' | 'task' | 'comment' | 'lead' | 'deal' | 'company' | 'contact';

export interface IComment {
	id: number;
	entityType: EntityType;
	entityId: number;
	message: string;
	authorId: string;
	date: number;
	mentioned: INotify[];
	notify: INotify[];
}
