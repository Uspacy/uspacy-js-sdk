import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IResponseWithMessage } from '../../models/response';
import { IUser } from '../../models/user';
import { IInvateDto } from './dto/create-invates.dto';

/**
 * Users service
 */
@injectable()
export class InvatesService {
	private namespace = '/company/v1';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Checking if an invitation exists.
	 * @param email user email
	 */
	checkInvateByEmail(email: string) {
		return this.httpClient.client.get<IResponseWithMessage>(`${this.namespace}/users/check_invite`, {
			urlParams: {
				email,
			},
		});
	}

	/**
	 * Create invites
	 */
	createInvates(body: IInvateDto[]) {
		return this.httpClient.client.post(`${this.namespace}/invites/email`, body);
	}

	/**
	 * Create invites batch
	 * @param emails users emails
	 */
	createInvatesBatch(emails: string[]) {
		return this.httpClient.client.post<IResponseWithMessage>(`${this.namespace}/invites/email/batch`, emails);
	}

	/**
	 * Resending an invitation
	 * @param userId user id
	 */
	resendInvateByUserId(userId: IUser['id']) {
		return this.httpClient.client.patch<IResponseWithMessage>(
			`${this.namespace}/invites/email/:userId/repeat_invitation`,
			{},
			{
				urlParams: {
					userId,
				},
			},
		);
	}

	/**
	 * Delete an invitation
	 * @param userId user id
	 */
	deleteInvateByUserId(userId: IUser['id']) {
		return this.httpClient.client.delete<IResponseWithMessage>(`${this.namespace}/invites/email/:userId`, {
			urlParams: {
				userId,
			},
		});
	}
}
