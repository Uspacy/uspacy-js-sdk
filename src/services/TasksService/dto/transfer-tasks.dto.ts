export interface ITransferTasksDto {
	oldUserId: number;
	newUserIds: number[];
	ownersUsers: number[];
	responsibleUsers: number[];
	auditorsUsers: number[];
	accomplicesUsers: number[];
	templatesUsers: number[];
}
