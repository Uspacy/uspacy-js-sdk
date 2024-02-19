/* eslint-disable camelcase */
import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IEmailBox, IEmailBoxes, IEmailFiltersParams, IFolders, ILetter, ILetters } from '../../models/email';
import { IResponseWithMeta } from '../../models/response';
import { IConnectEmailBox, IUpdateEmailBox } from './connect-email-box.dto';
import { ICreateLetterPayload } from './create-email.dto';

/**
 * Email service
 */
@injectable()
export class EmailService {
	private namespace = '/email/v1';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get emails boxes list
	 * @returns Array with emails boxes list entity
	 */
	getEmailsBoxes() {
		return this.httpClient.client.get<IResponseWithMeta<IEmailBoxes>>(`${this.namespace}/emails/`);
	}

	/**
	 * Get email box entity
	 * @param id email box id
	 * @returns Emails box entity
	 */
	getEmailBox(id: number) {
		return this.httpClient.client.get<IEmailBox>(`${this.namespace}/emails/:id`, { urlParams: { id } });
	}

	/**
	 * Connect email box
	 * @param data email box payload
	 * @returns Email box entity
	 */
	connectEmailBox(data: IConnectEmailBox) {
		return this.httpClient.client.post(`${this.namespace}/emails/credentials`, data);
	}

	/**
	 * Setup email box after connect
	 * @param id email box id
	 * @param data email box payload
	 * @returns Email box entity
	 */
	setupEmailBox(id: number, data: IUpdateEmailBox) {
		return this.httpClient.client.post(`${this.namespace}/emails/settings/:id`, data, { urlParams: { id } });
	}

	/**
	 * Update email box credentials (password, email and etc)
	 * @param id email box id
	 * @param data email box payload
	 * @returns Email box entity
	 */
	updateEmailBoxCredentials(id: number, data: IUpdateEmailBox) {
		return this.httpClient.client.patch(`${this.namespace}/emails/credentials/:id`, data, { urlParams: { id } });
	}

	/**
	 * Update email box
	 * @param id email box id
	 * @param data email box payload
	 * @returns Email box entity
	 */
	updateEmailBox(id: number, data: IUpdateEmailBox) {
		return this.httpClient.client.patch(`${this.namespace}/emails/settings/:id`, data, { urlParams: { id } });
	}

	/**
	 * Remove email box
	 * @param id email box id
	 */
	removeEmailBox(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/emails/:id`, { urlParams: { id } });
	}

	/**
	 * Get email folders list
	 * @returns Array with email folders list entity
	 */
	getEmailFolders() {
		return this.httpClient.client.get<IResponseWithMeta<IFolders>>(`${this.namespace}/folders/`);
	}

	/**
	 * Get email letters list
	 * @param id folder id
	 * @param params filters params
	 * @returns Array with email letters list entity by folder
	 */
	getEmailLetters(id: number, params: IEmailFiltersParams, signal: AbortSignal) {
		return this.httpClient.client.get<IResponseWithMeta<ILetters>>(`${this.namespace}/letters/by_folder/:id`, {
			urlParams: { id },
			params,
			signal,
		});
	}

	/**
	 * Get email chain letters in parent letter
	 * @param id parent email letter id
	 * @param params filters params
	 * @returns Array with email chain letters list entity by parent letter
	 */
	getEmailChainLetters(id: number, params: IEmailFiltersParams) {
		return this.httpClient.client.get<IResponseWithMeta<ILetters>>(`${this.namespace}/letters/:id/children`, {
			urlParams: { id },
			params,
		});
	}

	/**
	 * Get email letter
	 * @returns Email letter entity
	 */
	getEmailLetter(id: number) {
		return this.httpClient.client.get<ILetter>(`${this.namespace}/letters/:id`, { urlParams: { id } });
	}

	/**
	 * Create email letter
	 * @param data email letter payload
	 * @returns create email letter entity
	 */
	createEmailLetter(data: ICreateLetterPayload, id: number) {
		return this.httpClient.client.post<ILetter>(`${this.namespace}/letters/by_folder/:id`, data, { urlParams: { id } });
	}

	/**
	 * resend email letter
	 * @param id email letter id
	 */
	resendEmailLetter(id: number) {
		return this.httpClient.client.patch(`${this.namespace}/letters/:id/resend`, undefined, { urlParams: { id } });
	}

	/**
	 * Remove email letter
	 * @returns remove email letter entity
	 */
	removeEmailLetter(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/letters/:id`, { urlParams: { id } });
	}

	/**
	 * Remove email letters
	 * @param ids email ids array
	 * @returns remove email letters entity array
	 */
	removeEmailLetters(ids: number[]) {
		return this.httpClient.client.delete(`${this.namespace}/letters/`, { data: { ids } });
	}

	/**
	 * Change unread to read status in the email letters
	 * @param ids email letters ids array
	 */
	readEmailLetters(ids: number[], chain_ids: number[]) {
		return this.httpClient.client.patch(`${this.namespace}/letters/read`, {
			...(ids?.length > 0 && { ids }),
			...(chain_ids?.length > 0 && { chain_ids }),
		});
	}

	/**
	 * Change read to unread status in the email letters
	 * @param ids email letters ids array
	 */
	unreadEmailLetters(ids: number[], chain_ids: number[]) {
		return this.httpClient.client.patch(`${this.namespace}/letters/unread`, {
			...(ids?.length > 0 && { ids }),
			...(chain_ids?.length > 0 && { chain_ids }),
		});
	}

	/**
	 * Move letter from folder to folder
	 * @param letterId letters id
	 * @param folderId to folder id
	 */
	moveLetter(letterId: number, folderId: number) {
		return this.httpClient.client.patch<ILetter>(`${this.namespace}/letters/:letterId/move/:folderId`, { urlParams: { letterId, folderId } });
	}

	/**
	 * Move letters from folder to folder
	 * @param ids letters ids array
	 * @param folderId to folder id
	 */
	moveLetters(ids: number[], folderId: number, chain_ids: number[]) {
		return this.httpClient.client.patch(
			`${this.namespace}/letters/move/:folderId`,
			{ ...(ids?.length > 0 && { ids }), ...(chain_ids?.length > 0 && { chain_ids }) },
			{ urlParams: { folderId } },
		);
	}
}
