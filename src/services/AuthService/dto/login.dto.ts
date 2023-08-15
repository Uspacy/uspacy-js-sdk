/**
 * @param email user email
 * @param password user password
 * @param code 2FA code
 * @param remember remember session
 */
export interface ILoginDto {
	email: string;
	password: string;
	code?: string;
	remember?: boolean;
}
