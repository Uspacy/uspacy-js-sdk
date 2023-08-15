export interface IDepartment {
	id: number;
	name: string;
	description: string;
	headId: string;
	parentDepartmentId: string;
	usersIds: string[];
	roles: string[];
	main: boolean;
}
