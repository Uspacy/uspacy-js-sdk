import { EntityType } from '../../models/comment';
import { INotify } from '../../models/notify';

export interface IRootParent {
	data: { id: string; title: string };
	service: string;
	type: EntityType;
	table_name: string;
}

export interface ICreateCommentDto {
	entityType: EntityType;
	entityId: number;
	authorId: number;
	message: string;
	date?: number;
	mentioned?: INotify;
	notify?: INotify;
	root_parent?: IRootParent;
	/** Files uploaded in the form itself — from the device or dropped in. */
	file_ids?: number[];
	/** Files chosen on the Disk: attached as new records over the same content (files `mass_attach`); the originals stay where they are. */
	disk_file_ids?: number[];
	pinned?: number;
	read?: boolean;
}
