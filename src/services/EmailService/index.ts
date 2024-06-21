/* eslint-disable camelcase */
import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import {
	ICrmSetting,
	IEmailBox,
	IEmailBoxes,
	IEmailFiltersParams,
	IFolders,
	ILetter,
	ILetters,
	ILettersCrmEntities,
	IThreads,
} from '../../models/email';
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
	 * @param threads email letter threads
	 */
	removeEmailLetters(ids: number[], threads: IThreads) {
		return this.httpClient.client.delete(`${this.namespace}/letters/`, {
			data: { ids, ...(threads?.filter?.length > 0 && { threads }) },
		});
	}

	/**
	 * Change unread to read status in the email letters
	 * @param ids email letters ids array
	 * @param folderId to folder id
	 * @param threads email letter threads
	 */
	readEmailLetters(ids: number[], folderId: number, threads: IThreads) {
		return this.httpClient.client.patch(
			`${this.namespace}/letters/read/:folderId`,
			{ ...(ids?.length > 0 && { ids }), ...(threads?.filter?.length > 0 && { threads }) },
			{ urlParams: { folderId } },
		);
	}

	/**
	 * Change read to unread status in the email letters
	 * @param ids email letters ids array
	 * @param folderId to folder id
	 * @param threads email letter threads
	 */
	unreadEmailLetters(ids: number[], folderId: number, threads: IThreads) {
		return this.httpClient.client.patch(
			`${this.namespace}/letters/unread/:folderId`,
			{ ...(ids?.length > 0 && { ids }), ...(threads?.filter?.length > 0 && { threads }) },
			{ urlParams: { folderId } },
		);
	}

	/**
	 * Move letters from folder to folder
	 * @param ids letters ids array
	 * @param folderId to folder id
	 * @param threads email letter threads
	 */
	moveLetters(ids: number[], folderId: number, threads: IThreads) {
		return this.httpClient.client.patch(
			`${this.namespace}/letters/move/:folderId`,
			{ ...(ids?.length > 0 && { ids }), ...(threads?.filter?.length > 0 && { threads }) },
			{ urlParams: { folderId } },
		);
	}

	/**
	 * Get settings for integration with crm
	 * @param id email box id
	 * @returns settings data
	 */
	getIntgrWithCrmSettings(id: number) {
		return this.httpClient.client.get<ICrmSetting[]>(`${this.namespace}/emails/crm_settings/:id`, { urlParams: { id } });
	}

	/**
	 * Update letters crm entities
	 * @param id letter id
	 * @param data letters crm entities payload
	 */
	patchLetterCrmEntities(id: number, data: ILettersCrmEntities) {
		return this.httpClient.client.patch(`${this.namespace}/letters/:id`, { crm_entities: data }, { urlParams: { id } });
	}

	/**
	 * Redirect to OAuth 2 link
	 * @param url success link
	 * @param service microsoft, google and etc
	 */
	redirectToOauthLink(url: string, service: string) {
		return this.httpClient.client.get(`${this.namespace}/oauth/${service}/redirect`, { params: { state: url } });
	}

	/**
	 * Redirect to OAuth 2 link
	 * @param code code for mail box auth
	 * @param service microsoft, google and etc
	 */
	receiveToOauthLink(code: string, service: string) {
		return this.httpClient.client.post(`${this.namespace}/oauth/${service}/receive`, { code });
	}
}
