import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IApiEnvelope, IOAuthClientsPaginator, IOAuthClientWithSecret, IOAuthPermissionGroup } from '../../models/oauthClients';
import { IOAuthClientRequest } from './dto/create-oauth-client.dto';

/**
 * OAuth clients service (External connectors).
 */
@injectable()
export class OAuthClientsService {
	private namespace = '/company/v1/oauth_clients';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get the workspace's OAuth clients.
	 */
	getOAuthClients() {
		return this.httpClient.client.get<IApiEnvelope<IOAuthClientsPaginator>>(this.namespace);
	}

	/**
	 * Create an OAuth client. Returns the client including the one-time secret.
	 * @param body name + selected permission keys (area.entity.action)
	 */
	createOAuthClient(body: IOAuthClientRequest) {
		return this.httpClient.client.post<IApiEnvelope<IOAuthClientWithSecret>>(this.namespace, body);
	}

	/**
	 * Delete an OAuth client by id (client_id).
	 */
	deleteOAuthClient(id: string) {
		return this.httpClient.client.delete<{ status: boolean; message: string }>(`${this.namespace}/:id`, { urlParams: { id } });
	}

	/**
	 * Get the available permissions catalog for the client scope selector.
	 */
	getAvailablePermissions() {
		return this.httpClient.client.get<IApiEnvelope<IOAuthPermissionGroup[]>>(`${this.namespace}/available_permissions`);
	}
}
