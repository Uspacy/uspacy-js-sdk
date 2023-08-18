interface ISocialMediaLinks {
	id?: string;
	name: string;
	link: string;
}

interface IEmail {
	id?: string;
	type: string;
	value: string;
	main: boolean;
}

interface IPhone {
	id?: string;
	type: string;
	value: string;
}

export enum MainRoles {
	ADMIN = 'ADMIN',
	OWNER = 'OWNER',
}

export type UserRole = MainRoles | string;

export interface IUser {
	id: number;
	authUserId: number;
	firstName: string;
	lastName: string;
	patronymic: string;
	position: string;
	specialization: string;
	country: string;
	city: string;
	avatar: string;
	aboutMyself: string;
	active: boolean;
	registered: boolean;
	birthday: number;
	dateOfDismiss: number;
	showBirthYear: boolean;
	email: IEmail[];
	phone: IPhone[];
	roles: UserRole[];
	departmentsIds: string[];
	socialMedia: ISocialMediaLinks[];
	emailInvitation: boolean;
	dateOfInvitation: number;
}
