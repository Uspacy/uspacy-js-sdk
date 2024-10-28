import { EntityType } from '../../models/comment';
import { INotify } from '../../models/notify';

export interface IRootParent {
	data: { id: string; title: string };
	service: string;
	type: EntityType;
	table_name: string;
}

export interface ICreateCommentDto {
	entity_type: EntityType;
	entity_id: number;
	authorId: number;
	message: string;
	date: number;
	mentioned: INotify;
	notify: INotify;
	root_parent?: IRootParent;
	files_ids?: number[];
	pinned?: number;
	read?: boolean;
}
