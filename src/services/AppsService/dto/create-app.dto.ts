/**
 * Create App DTO
 * @param name App name
 * @param code App code
 * @param short_description App short description
 * @param redirect_url App redirect url
 * @param callback_url App callback url
 * @param developer_name App developer name
 * @param developer_link App developer link
 * @param logo App logo
 */
export interface ICreateAppDto {
	name: string;
	code: string;
	short_description: string;
	redirect_url: string;
	callback_url: string;
	developer_name: string;
	developer_link: string;
	logo: File;
}
