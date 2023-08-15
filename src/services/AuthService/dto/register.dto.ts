/**
 * @param email user email
 * @param password user password
 * @param firstName user first name
 * @param lastName user last name
 * @param domain portal domain
 */
export interface IRegisterDto {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	domain: string;
}
