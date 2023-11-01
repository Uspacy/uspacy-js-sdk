import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IGroup } from '../../models/groups';
import { IResponseWithMeta } from '../../models/response';
import { IGroupDto, IInviteUsersDto } from './dto/create-update-groups.dto';

/**
 * Groups service
 */
@injectable()
export class GroupsService {
	private namespace = '/groups/v1/groups';
	private namespacev1 = '/groups/v1';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get group item
	 * @param id group id
	 * @returns Group entity
	 */
	getGroup(id: string) {
		return this.httpClient.client.get<IGroup>(`${this.namespace}/:id/`, { urlParams: { id } });
	}

	/**
	 * Get group for task item
	 * @param id group id
	 * @returns Group entity
	 */

	// ! I added this method because our logic changed after integrating the new store and the old logic affects the new one
	getGroupForTask(id: string) {
		return this.httpClient.client.get<IGroup>(`${this.namespace}/:id/`, { urlParams: { id } });
	}

	/**
	 * Get groups
	 * @param page group page number
	 * @param list group list number
	 * @param userId group user id
	 * @param search group search query
	 * @returns Groups entities array
	 */
	getGroups(page?: number, list?: number, userId?: number, q?: string) {
		return this.httpClient.client.get<IResponseWithMeta<IGroup>>(`${this.namespace}`, { params: { page, list, userId, q } });
	}

	/**
	 * Create group
	 */
	createGroup(body: IGroupDto) {
		const formData = new FormData();

		formData.append('name', body.name ? body.name : '');
		formData.append('groupType', body.groupType ? body.groupType : '');
		formData.append('description', body.description ? body.description : '');
		formData.append('groupTheme', body.groupTheme ? body.groupTheme : '');
		formData.append('ownerId', body.ownerId ? body.ownerId : '');
		formData.append('logo', body.logo ? body.logo : '');
		body.moderatorsIds.length > 0
			? body.moderatorsIds.map((el) => {
					formData.append('moderatorsIds[]', el);
			  })
			: '';
		body.usersIds.length > 0
			? body.usersIds.map((el) => {
					formData.append('usersIds[]', el);
			  })
			: '';
		return this.httpClient.client.post(`${this.namespace}`, formData);
	}

	/**
	 * Edit group
	 */

	editGroup(body: IGroupDto) {
		const id = body.groupId;

		return this.httpClient.client.patch<IGroup>(`${this.namespace}/:id/`, body, {
			urlParams: { id },
		});
	}

	/**
	 * Delete group
	 * @param id group id
	 */
	deleteGroup(id: number) {
		return this.httpClient.client.delete<IGroup>(`${this.namespace}/:id/`, { urlParams: { id } });
	}

	/**
	 * Invite users group
	 * @param body invite users Dto
	 */
	inviteUsersInGroup(body: IInviteUsersDto) {
		return this.httpClient.client.post(`${this.namespacev1}/invites/`, body);
	}

	/**
	 * Leave from the group
	 * @param id group id
	 */
	leaveGroup(id: string) {
		return this.httpClient.client.patch(`${this.namespace}/:id/leaveGroup`, id, { urlParams: { id } });
	}

	/**
	 * Join the group
	 * @param id group id
	 */
	joinGroup(id: string) {
		return this.httpClient.client.patch(`${this.namespace}/:id/joinGroup`, id, { urlParams: { id } });
	}

	/**
	 * Join the group
	 * @param id group id
	 */
	getUsersRequestedForJoing(id: string) {
		return this.httpClient.client.get(`${this.namespacev1}/join/:id`, { urlParams: { id } });
	}

	/**
	 * Accept users invite request
	 * @param id group id
	 * @param userId user id
	 */
	acceptUserInviteRequest(id: string, userId: number) {
		return this.httpClient.client.patch(`${this.namespace}/:id/attachUser/${userId}`, { urlParams: { id, userId } });
	}

	/**
	 * Decline users invite request
	 * @param id group id
	 * @param userId user id
	 */
	rejectUserInviteRequest(id: string, userId: number) {
		return this.httpClient.client.delete(`${this.namespacev1}/join/:id/request/${userId}`, { urlParams: { id, userId } });
	}

	/**
	 * Decline users invite request
	 * @param id group id
	 * @param logo logo File
	 */
	uploadLogo(id: string, logo?: File) {
		const logoFormData = new FormData();
		logoFormData.append('logo', logo ? logo : '');

		return this.httpClient.client.post(`${this.namespace}/:id/upload_logo`, { urlParams: { id }, params: logoFormData });
	}

	/**
	 * User apply to join to the group
	 * @param id user id
	 */
	userApplyToJoinGroup(id: string) {
		return this.httpClient.client.post(`${this.namespacev1}/join/:id/request/`, { urlParams: { id } });
	}

	/**
	 * Decline users invite request
	 * @param groupId group id
	 * @param userId user id
	 */
	checkIfUserSendJoinRequest(groupId: string, userId: number) {
		return this.httpClient.client.get(`${this.namespacev1}/join/:groupId/request/:userId`, { urlParams: { groupId, userId } });
	}
}
