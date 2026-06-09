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
		return this.httpClient.client.get<IPortalSettings>(`${this.namespace}/general`, { params: { domain } });
	}

	/**
	 * Update portal settings
	 * @param data - portal settings payload
	 * @returns portal settings
	 */
	async updatePortalSettings(data: Partial<IPortalSettings>) {
		const domain = await this.tokenService.getDomain();
		return this.httpClient.client.patch<IPortalSettings>(`${this.namespace}/general`, data, { params: { domain } });
	}
}
