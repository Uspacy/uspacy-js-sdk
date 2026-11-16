import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { EntityMentionType, IMention, IMentionQuota } from '../../models/mentions';
import { IMentionCreateDto, IMentionUpdateDto } from './dto/mention.dto';

/**
 * Mentions service — named multiple mentions (users / groups / departments)
 */
@injectable()
export class MentionsService {
	private namespace = '/messenger/v1/mentions';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get all mentions of the portal
	 * @returns array of mentions
	 */
	getMentions() {
		return this.httpClient.client.get<IMention[]>(this.namespace);
	}

	/**
	 * Get the tariff quota for mentions
	 */
	getQuota() {
		return this.httpClient.client.get<IMentionQuota>(`${this.namespace}/quota`);
	}

	/**
	 * Create a custom mention
	 * @param body mention fields
	 */
	createMention(body: IMentionCreateDto) {
		return this.httpClient.client.post<IMention>(this.namespace, body);
	}

	/**
	 * Update a custom mention
	 * @param id mention id
	 * @param body fields to update
	 */
	updateMention(id: string, body: IMentionUpdateDto) {
		return this.httpClient.client.patch<IMention>(`${this.namespace}/:id`, body, { urlParams: { id } });
	}

	/**
	 * Delete a custom mention
	 * @param id mention id
	 */
	deleteMention(id: string) {
		return this.httpClient.client.delete<IMention>(`${this.namespace}/:id`, { urlParams: { id } });
	}

	/**
	 * Create, rename or remove the mention of a group or a department
	 * @param type group | department
	 * @param entityId group or department id
	 * @param name mention name, null removes the mention
	 * @returns the mention or null when it was removed
	 */
	setEntityMention(type: EntityMentionType, entityId: number, name: string | null) {
		return this.httpClient.client.put<IMention | null>(`${this.namespace}/entity/:type/:entityId`, { name }, { urlParams: { type, entityId } });
	}
}
