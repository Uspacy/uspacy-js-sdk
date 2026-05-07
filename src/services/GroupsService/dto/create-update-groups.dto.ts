import { IThemeSettings } from '../../../models/groups';

export interface IGroupDto {
	name: string;
	groupType: string;
	description?: string;
	groupTheme?: string;
	ownerId?: string;
	logo?: File;
	moderatorsIds?: string[];
	usersIds?: string[];
	externalUserIds?: string[];
	groupId?: string;
	archived?: number;
	enableColorTheme?: boolean;
	themeSettings?: IThemeSettings;
}

export interface IInviteUsersDto {
	groupId: string;
	userIds: string[];
}
