/**
 * @param portalName portal name
 * @param domain portal domain
 * @param firstName owner first name
 * @param email owner email
 * @param password owner email
 */
export interface ICreatePortalDto {
	portalName: string;
	domain: string;
	firstName: string;
	email: string;
	password: string;
}
