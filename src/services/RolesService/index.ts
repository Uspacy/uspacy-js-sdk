import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IPermissions, IPermissionsFunnelsResponse, IRole } from '../../models/roles';
import { ICreateRoleDto, IUpdateRolePermissionsFunnels, IUptadeRoleDto } from './create-update-role-dto';

/**
 * Roles service
 */
@injectable()
export class RolesService {
	private namespace = '/company/v1';
	private crmNamespace = '/crm/v1';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get roles
	 * @returns list of roles
	 */
	getRoles() {
		return this.httpClient.client.get<IRole[]>(`${this.namespace}/roles`);
	}

	/**
	 * Get permissions
	 * @returns list of permissions
	 */
	getPermissions() {
		return this.httpClient.client.get<IPermissions>(`${this.namespace}/permissions`);
	}

	/**
	 * Get role by id
	 * @returns role entity
	 */
	getRole(id: string) {
		return this.httpClient.client.get(`${this.namespace}/roles/:id`, { urlParams: { id } });
	}

	/**
	 * Update role entity
	 */
	updateRole(body: IUptadeRoleDto) {
		const { id, ...clone } = body;
		return this.httpClient.client.patch(`${this.namespace}/roles/:id`, clone, { urlParams: { id } });
	}

	/**
	 * Create role entity
	 */
	createRole(body: ICreateRoleDto) {
		return this.httpClient.client.post(`${this.namespace}/roles/`, body);
	}

	/**
	 * Delete role entity
	 */
	deleteRole(id: string) {
		return this.httpClient.client.delete(`${this.namespace}/roles/:id`, { urlParams: { id } });
	}

	/**
	 * Get permissions funnels
	 * @returns list of funnels
	 */
	getPermissionsFunnels(role: string) {
		return this.httpClient.client.get<IPermissionsFunnelsResponse>(`${this.crmNamespace}/permissions/funnels`, { urlParams: { role } });
	}

	/**
	 * Update role permissions funnels
	 */
	updateRolePermisionsFunnels(body: IUpdateRolePermissionsFunnels) {
		return this.httpClient.client.post(`${this.crmNamespace}/permissions`, body);
	}
}
