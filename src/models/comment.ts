import { IFile } from './files';
import { INotify } from './notify';

export type EntityType = 'post' | 'task' | 'comment' | 'lead' | 'deal' | 'company' | 'contact';

export interface IComment {
	id: number;
	entityType: EntityType;
	entityId: number;
	authorId: string;
	message: string;
	date: number;
	pinned: number;
	commentId: number;
	nextId: number;
	prevId: number;
	read: boolean;
	subComments?: {
		data?: IComment[];
		total?: number;
	};
	files?: IFile[];
	mentioned?: INotify[];
	notify: INotify[];
	reactions?: {
		reaction: number;
		amount: number;
		entityId: number;
	}[];
}

export interface ICommentParams {
	entityType: EntityType;
	entityId: number;
	page?: number;
	list?: number;
	q?: string;
	childList?: number;
	pinned?: number;
	nextId?: number;
	lastId?: number;
}
