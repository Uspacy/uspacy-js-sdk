/**
 * @param email user email
 * @param password user password
 * @param token token from recover link
 */
export interface IResetPassordDto {
	email: string;
	password: string;
	token: string;
}
