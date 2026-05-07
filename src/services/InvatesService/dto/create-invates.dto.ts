/**
 * @param email user email
 * @param firstName	user firstName
 * @param lastName user lastName
 */
export interface IInvateDto {
	email: string;
	firstName: string;
	lastName: string;
	external_user: boolean;
}
