import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IFolders, ILetter, ILetters } from '../../models/email';
import { IResponseWithMeta } from '../../models/response';
import { ICreateLetterPayload } from './create-email.dto';

/**
 * Email service
 */
@injectable()
export class EmailService {
	private namespace = '/email/v1';

	constructor(private httpClient: HttpClient) {}

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
		return this.httpClient.client.get<IResponseWithMeta<ILetters>>(`${this.namespace}/letters/by-folder/:id`, {
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
		return this.httpClient.client.post<ILetter>(`${this.namespace}/letters/by-folder/:id`, data, { urlParams: { id } });
	}

	/**
	 * Remove email letter
	 * @returns remove email letter entity
	 */
	removeEmailLetter(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/letters/:id`, { urlParams: { id } });
	}
}
