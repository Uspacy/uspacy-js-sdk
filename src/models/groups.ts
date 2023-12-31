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
}
