import { HttpClient } from 'core/HttpClient';
import { I2FaEnable, I2FaStatus } from 'models/2fa';
import { IResponseWithMessage } from 'models/response';
import { IPortalSettings } from 'models/settings';
import { IUser } from 'models/user';
import { injectable } from 'tsyringe';

/**
 * Users service
 */
@injectable()
export class ProfileService {
	private namespace = '/company/v1/users/me';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get 2fa
	 * @returns user portal settings
	 */
	get2FaStatus() {
		return this.httpClient.client.get<I2FaStatus>(`${this.namespace}/twofa_status/`);
	}

	/**
	 * Enable 2fa
	 * @returns user portal settings
	 */
	enable2Fa() {
		return this.httpClient.client.patch<I2FaEnable>(`${this.namespace}/twofa_enable/`);
	}

	/**
	 * Disable 2fa
	 * @returns user portal settings
	 */
	disable2Fa() {
		return this.httpClient.client.patch<IResponseWithMessage>(`${this.namespace}/twofa_disable/`);
	}

	/**
	 * Get self profile
	 * @returns user profile data
	 */
	getProfile() {
		return this.httpClient.client.get<IUser>(`${this.namespace}/`);
	}

	/**
	 * update portal ettings by user id
	 * @param settings
	 * @returns user portal settings
	 */
	getPortalSettings() {
		return this.httpClient.client.get<IPortalSettings>(`${this.namespace}/settings/`);
	}

	/**
	 * update portal ettings by user id
	 * @param settings
	 * @returns user portal settings
	 */
	updatePortalSettings(settings: IPortalSettings) {
		return this.httpClient.client.patch<IPortalSettings>(`${this.namespace}/settings/`, settings);
	}
}
