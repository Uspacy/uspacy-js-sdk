/**
 * @param email user email
 * @param password user password
 * @param firstName user first name
 * @param lastName user last name
 */
export interface ISignUpDto {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}
