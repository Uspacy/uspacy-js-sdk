import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { TokensService } from '../../core/TokensService';
import { IPortalSettings } from '../../models/settings';

/**
 * Settings service
 */
@injectable()
export class SettingsService {
	private namespace = '/settings/v1/settings';

	constructor(
		private httpClient: HttpClient,
		private tokenService: TokensService,
	) {}

	/**
	 * Get portal settings
	 * @returns portal settings
	 */
	async getPortalSettings() {
		const domain = await this.tokenService.getDomain();
		return this.httpClient.client.get(`${this.namespace}/general`, { urlParams: { domain } });
	}

	/**
	 * Update portal settings
	 * @param data - portal settings to update
	 * @returns portal settings
	 */
	async updatePortalSettings(data: Partial<IPortalSettings>) {
		const domain = await this.tokenService.getDomain();
		return this.httpClient.client.put(`${this.namespace}/general`, data, { urlParams: { domain } });
	}
}
