export interface IUptadeRoleDto {
	id: string;
	title?: string;
	usersIds?: string[];
	departmentList?: IDepartment[];
	permissions?: string[];
}

interface IDepartment {
	id: string;
	name: string;
	dateUpdate: number;
}

export interface ICreateRoleDto {
	title: string;
	permissions: string[];
}
