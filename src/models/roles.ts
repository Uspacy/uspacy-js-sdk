import { IDepartment } from './department';
import { IUser } from './user';

export interface IPermissions {
	create: string[];
	view: string[];
	edit: string[];
	delete: string[];
	export?: string[];
}

export interface IRole {
	id: string;
	code: string;
	title?: string;
	userList: IUser[];
	departmentList?: IDepartment[];
	permissions: IPermissions;
}

export interface IPermissionsFunnels {
	entity_type: string;
	action: string;
	level: string;
	entity_id: number;
}
