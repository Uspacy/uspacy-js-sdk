import { UserRole } from './user';

export enum Available {
	EXTERNAL_USERS = 'EXTU',
}

export type AvailableConfigs = Available | string;

export interface IJwt {
	id: number;
	exp: number;
	authUserId: number;
	email: string;
	firstName: string;
	lastName: string;
	workspaceId: string;
	domain: string;
	roles: UserRole[];
	departments: number[];
	tariffId: number;
	available: AvailableConfigs[];
	permissions: {
		create: string[];
		view: string[];
		edit: string[];
		delete: string[];
		export: string[];
	};
}

/**
 * Jwt data
 */
export interface IResponseJwt {
	jwt: string;
	refreshToken: string;
	/**
	 * time in seconds when token will be expired
	 */
	expiresInSeconds: number;
}
