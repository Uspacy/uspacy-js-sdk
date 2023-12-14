import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IEmailBox, IEmailBoxes, IFolders, ILetter, ILetters } from '../../models/email';
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
	 * @returns Array with email letters list entity by folder
	 */
	getEmailLetters(id: number, page: number, list: number) {
		return this.httpClient.client.get<IResponseWithMeta<ILetters>>(`${this.namespace}/letters/by_folder/:id`, {
			urlParams: { id },
			params: { page, list },
		});
	}

	/**
	 * Get email letter
	 * @returns Email letter entity
	 */
	getEmailLetter(id: number) {
		return this.httpClient.client.get<IResponseWithMeta<ILetter>>(`${this.namespace}/letters/:id`, { urlParams: { id } });
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
	 * Remove email letter
	 * @returns remove email letter entity
	 */
	removeEmailLetter(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/letters/:id`, { urlParams: { id } });
	}
}
