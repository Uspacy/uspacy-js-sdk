import { UserRole } from './user';

export enum Available {
	EXTERNAL_USERS = 'EXTU',
}

export type AvailableConfigs = Available | string;

export interface IJwt {
	id: number;
	exp: number;
	iat?: number;
	/**
	 * id of the server-side session (tokens of servers with sessions)
	 */
	sid?: string;
	typ?: 'access' | 'refresh';
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
	isEmailVerified?: boolean;
	/**
	 * Unix time by which the user has to set up 2FA
	 */
	twofaSetupDeadline?: number;
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
