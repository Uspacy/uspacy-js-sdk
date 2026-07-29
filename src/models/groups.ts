export interface IGroup {
	id: string;
	name: string;
	groupType: string;
	ownerId: string;
	archival: boolean;
	description: string;
	groupTheme: string;
	logo: string;
	moderatorsIds: string[];
	usersIds: string[];
	externalUserIds: string[];
	enableColorTheme: boolean;
	themeSettings: IThemeSettings;
	settings?: IGroupSettings;
}

export interface IThemeSettings {
	bgColor: string;
	iconColor: string;
	icon: string;
	enablePattern: boolean;
}

export interface IGroupSettings {
	letMembersSeeAllTasks: boolean;
}
