import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { ISecuritySettings, IUpdateSecuritySettings } from '../../models/security-settings';

/**
 * Workspace security settings service
 */
@injectable()
export class SecuritySettingsService {
	private namespace = '/company/v1/security_settings';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get the workspace security settings (Owner and Admin)
	 * @returns settings and the Owners and Admins without 2FA
	 */
	getSecuritySettings() {
		return this.httpClient.client.get<ISecuritySettings>(this.namespace);
	}

	/**
	 * Update the workspace security settings (Owner only)
	 * @param body settings to change; turning `twofaRequired` off takes the Owner's 2FA `code`
	 * @returns updated settings
	 */
	updateSecuritySettings(body: IUpdateSecuritySettings) {
		return this.httpClient.client.patch<ISecuritySettings>(this.namespace, body);
	}
}
