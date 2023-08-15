export interface ICreateDepartmentDto {
	name: string;
	description: string;
	headId: string;
	parentDepartmentId: string;
	userIds: string[];
}
