export interface ITransferGroupsDto {
	oldUserId: number;
	newUserIds: number[];
	moderators: number[];
	group_owners: number[];
	group_members: boolean;
}
