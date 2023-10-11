import { IFile } from './files';
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
	files?: IFile[];
	nextId?: number | null;
	prevId?: number | null;
	reactions?: {
		reaction: number;
		amount: number;
		entityId: number;
	}[];
}
