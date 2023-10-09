export interface IGroupDto {
	name: string;
	groupType: string;
	description?: string;
	groupTheme?: string;
	ownerId?: string;
	logo?: File;
	moderatorsIds?: string[];
	usersIds?: string[];
	groupId?: string;
	archived?: number;
}

export interface IInviteUsersDto {
	groupId: string;
	userIds: string[];
}
