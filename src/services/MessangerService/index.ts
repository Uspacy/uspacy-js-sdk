import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { FetchMessagesRequest, GoToMessageRequest, IChat } from '../../models/messanger';

/**
 * Messanger service
 */
@injectable()
export class MessangerService {
	private namespace = '/messenger/v1';
	constructor(private readonly httpClient: HttpClient) {}

	/**
	 * Get chats
	 * @returns list of chats
	 */
	async getChats(type?: 'EXTERNAL') {
		return this.httpClient.client.get<IChat[]>(`${this.namespace}/chats`, {
			params: { type },
		});
	}

	/**
	 * Get messages
	 * @param chatId chat id
	 * @param limit fetch messages count
	 * @param lastTimestamp for :id urlParams
	 * @param firstTimestamp for :id urlParams
	 * @returns list of messages for chat
	 */
	async getMessages({ chatId, limit, lastTimestamp, firstTimestamp }: FetchMessagesRequest) {
		return this.httpClient.client.get(`${this.namespace}/messages/`, {
			params: { chatId, limit, lastTimestamp, firstTimestamp },
		});
	}

	/**
	 * Go to message
	 * @param id message id
	 * @returns out message ( and 10 next and 10 previous messages if we don't have our message in store )
	 */
	async goToMessage({ id }: GoToMessageRequest) {
		return this.httpClient.client.get(`${this.namespace}/messages/${id}/goToMessage/`);
	}

	/**
	 * Get pinned messages
	 * @param chatId chat id
	 * @returns pinned messages for chat
	 */
	async getPinnedMessages(chatId: IChat['id']) {
		return this.httpClient.client.get(`${this.namespace}/messages/getPinnedMessages/`, {
			params: { chatId },
		});
	}
}
