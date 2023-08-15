import { AxiosResponse } from 'axios';
import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { I2FaEnable } from '../../models/2fa';
import { IResponseWithMessage, IResponseWithPagination } from '../../models/response';
import { IPortalSettings } from '../../models/settings';
import { IUser, UserRole } from '../../models/user';
import { ISearchUsersDto } from './dto/search-users.dto';
import { IUpdateUserDto } from './dto/update-user.dto';
import { IUploadAvatar } from './dto/upload-avatar.dto';

/**
 * Users service
 */
@injectable()
export class UsersService {
	private namespace = '/company/v1/users';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get users list
	 * @param page page number
	 * @param list elements count
	 * @param show get list of with unactive users (available only for admin or owner)
	 * @returns Array users entity
	 */
	getUsers(page?: number, list?: number, show?: 'all'): Promise<AxiosResponse<IResponseWithPagination<IUser>>>;
	getUsers(page?: number, list?: 'all', show?: 'all'): Promise<AxiosResponse<IUser[]>>;
	getUsers(page?: number, list?: number | 'all', show?: 'all') {
		if (list === 'all') {
			return this.httpClient.client.get<IUser[]>(this.namespace, {
				params: {
					page,
					list,
					show,
				},
			});
		}
		return this.httpClient.client.get<IResponseWithPagination<IUser>>(this.namespace, {
			params: {
				page,
				list,
				show,
			},
		});
	}

	/**
	 * Get user by id
	 * @param id user id
	 * @returns user entity
	 */
	getUserById(id: string) {
		return this.httpClient.client.get<IUser>(`${this.namespace}/:id`, {
			urlParams: {
				id,
			},
		});
	}

	/**
	 * Update user data by id.
	 * @param id user id
	 * @param config user info (interface)
	 * @returns updated user
	 */

	updateUser(id: string, body: IUpdateUserDto) {
		return this.httpClient.client.patch<IUser>(`${this.namespace}/:id`, body, {
			urlParams: {
				id,
			},
		});
	}

	/**
	 * Deactivate user by id
	 * @param id user id
	 * @returns user data with active: false
	 */
	deactivateUser(id: string) {
		return this.httpClient.client.post<IUser>(`${this.namespace}/:id/deactivate`, {
			urlParams: {
				id,
			},
		});
	}

	/**
	 * Activate user by id.
	 * @param id user id
	 * @returns user data with active: true
	 */
	activateUser(id: string) {
		return this.httpClient.client.post<IUser>(`${this.namespace}/:id/activate`, {
			urlParams: {
				id,
			},
		});
	}

	/**
	 * Update user roles by id.
	 * @param id user id
	 * @returns user data with new roles
	 */
	updateRoles(id: string, roles: UserRole[]) {
		return this.httpClient.client.patch<IUser>(
			`${this.namespace}/:id/update_roles`,
			{ roles },
			{
				urlParams: { id },
			},
		);
	}

	/**
	 * Update user position by id
	 * @param id user id
	 * @param position user position
	 * @returns user data with new position
	 */
	updatePosition(id: string, position: string) {
		return this.httpClient.client.patch<IUser>(
			`${this.namespace}/:id/update_position`,
			{
				position,
			},
			{
				urlParams: { id },
			},
		);
	}

	/**
	 * get portal ettings by user id
	 * @param id user id
	 * @returns user portal settings
	 */
	getPortalSettingsByUserId(id: string) {
		return this.httpClient.client.get<IPortalSettings>(`${this.namespace}/:id/settings`, {
			urlParams: { id },
		});
	}

	/**
	 * update portal ettings by user id
	 * @param settings
	 * @returns user portal settings
	 */
	updatePortalSettingsByUserId(id: string, settings: IPortalSettings) {
		return this.httpClient.client.patch<IPortalSettings>(`${this.namespace}/:id/settings`, settings, {
			urlParams: { id },
		});
	}

	/**
	 * Get 2fa status by user id
	 * @param id user id
	 * @returns user portal settings
	 */
	get2FaStatusByUserId(id: string) {
		return this.httpClient.client.get<{ enabled: boolean }>(`${this.namespace}/:id/twofa_status`, {
			urlParams: { id },
		});
	}

	/**
	 * disable 2fa by user id
	 * @param id user id
	 * @returns user portal settings
	 */
	disable2FaByUserId(id: string) {
		return this.httpClient.client.get<IResponseWithMessage>(`${this.namespace}/:id/twofa_disable`, {
			urlParams: { id },
		});
	}

	/**
	 * Get 2fa
	 * @returns user portal settings
	 */
	getSelf2FaStatus() {
		return this.httpClient.client.get<{ enabled: boolean }>(`${this.namespace}/me/twofa_status`);
	}

	/**
	 * Enable 2fa
	 * @returns user portal settings
	 */
	enableSelf2Fa() {
		return this.httpClient.client.patch<I2FaEnable>(`${this.namespace}/me/twofa_enable`);
	}

	/**
	 * Disable 2fa
	 * @returns user portal settings
	 */
	disableSelf2Fa() {
		return this.httpClient.client.patch<IResponseWithMessage>(`${this.namespace}/me/twofa_disable`);
	}

	/**
	 * Search users
	 * @returns user portal settings
	 */
	search(body: ISearchUsersDto) {
		return this.httpClient.client.get<IResponseWithPagination<IUser>>(`${this.namespace}/search/`, {
			params: {
				...body,
			},
		});
	}

	/**
	 * Upload avatar
	 * @returns user portal settings
	 */
	uploadAvatar(body: IUploadAvatar) {
		const formData = new FormData();
		formData.append('avatar', body.file ? body.file : '""');
		if (body.userId) formData.append('userId', body.userId);
		return this.httpClient.client.post<IUser>(`${this.namespace}/upload_avatar/`, formData);
	}

	/**
	 * Upload avatar
	 * @returns user portal settings
	 */
	getUsersByIds(ids: Pick<IUser, 'id'>[]) {
		return this.httpClient.client.get<IResponseWithPagination<IUser>>(`${this.namespace}/upload_avatar/`, {
			params: {
				ids,
			},
		});
	}

	/**
	 * Get self profile
	 * @returns user profile data
	 */
	getProfile() {
		return this.httpClient.client.get<IUser>(`${this.namespace}/me/`);
	}

	/**
	 * Update selft portal setting
	 * @param settings
	 * @returns user portal settings
	 */
	updateUserPortalSettings(id: string, settings: IPortalSettings) {
		return this.httpClient.client.patch<IPortalSettings>(`${this.namespace}/:id/settings`, settings, {
			urlParams: { id },
		});
	}

	/**
	 * update portal ettings by user id
	 * @param settings
	 * @returns user portal settings
	 */
	getSelfPortalSettings() {
		return this.httpClient.client.get<IPortalSettings>(`${this.namespace}/me/settings`);
	}

	/**
	 * update portal ettings by user id
	 * @param settings
	 * @returns user portal settings
	 */
	updateSelfPortalSettings(settings: IPortalSettings) {
		return this.httpClient.client.patch<IPortalSettings>(`${this.namespace}/me/settings`, settings);
	}
}
