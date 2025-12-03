/* eslint-disable @typescript-eslint/no-explicit-any */
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
	external_user: boolean;
	[key: string]: any;
}

export interface IUserFilter {
	search?: string;
	page?: number;
	perPage?: number;
	boolean_operator?: string;
	openDatePicker?: boolean;
	status?: string[];
	country?: string[];
	head?: number[];
	department?: number[];
	table_fields?: string[];
	sortModel?: { [key: string]: string }[];
	[key: string]: any;
}
