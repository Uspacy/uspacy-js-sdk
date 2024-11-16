import { IFile } from './files';
import { INotify } from './notify';
import { IMeta } from './response';

export type EntityType = 'post' | 'task' | 'comment' | 'lead' | 'deal' | 'company' | 'contact';
export type CommentSortType = 'asc' | 'desc';

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
		data: IComment[];
		meta: IMeta;
		prevMeta?: IMeta;
		nextMeta?: IMeta;
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
	childPage?: number;
	pinned?: number;
	nextId?: number;
	lastId?: number;
	id?: number;
	sortBy?: {
		id: CommentSortType;
	};
}
