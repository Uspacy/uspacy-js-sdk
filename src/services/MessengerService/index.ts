import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { FetchMessagesRequest, ForwardMessageRequest, GoToMessageRequest, IChat, ICreateMessageData, ICreateWidgetData, ReadMessagesRequest } from '../../models/messenger';

/**
 * Messenger service
 */
@injectable()
export class MessengerService {
	private namespace = '/messenger/v1';
	constructor(private readonly httpClient: HttpClient) {}

	/**
	 * Get chats
	 * @returns list of chats
	 */
	async getChats({ type }: { type?: 'EXTERNAL' }) {
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
	async getMessages({ chatId, limit, lastTimestamp, firstTimestamp, unreadFirst }: FetchMessagesRequest) {
		return this.httpClient.client.get(`${this.namespace}/messages`, {
			params: { chatId, limit, lastTimestamp, firstTimestamp, unreadFirst },
		});
	}

	/**
	 * Post new message
	 * @param data create message payload
	 * @returns created message data
	 */
	async postMessage(data: ICreateMessageData) {
		return this.httpClient.client.post(`${this.namespace}/messages`, data);
	}

	/**
	 * Update message
	 * @param data create message payload
	 * @returns update message data
	 */
	async patchMessage(data: ICreateMessageData) {
		return this.httpClient.client.patch(`${this.namespace}/messages`, data);
	}

	/**
	 * Forward messages
	 * @param data forward messages payload
	 */
	async forwardMessages({ chatId, messagesIds }: ForwardMessageRequest) {
		return this.httpClient.client.post(`${this.namespace}/messages/forwardMessages`, { chatId, messagesIds });
	}

	/**
	 * Go to message
	 * @param id message id
	 * @returns out message ( and 10 next and 10 previous messages if we don't have our message in store )
	 */
	async goToMessage({ id }: GoToMessageRequest) {
		return this.httpClient.client.get(`${this.namespace}/messages/${id}/goToMessage`);
	}

	/**
	 * Get pinned messages
	 * @param chatId chat id
	 * @returns pinned messages for chat
	 */
	async getPinnedMessages(chatId: IChat['id']) {
		return this.httpClient.client.get(`${this.namespace}/messages/getPinnedMessages`, {
			params: { chatId },
		});
	}

	/**
	 * Read all messages
	 * @param chatId chat id
	 */
	async readAllMessages(chatId: IChat['id']) {
		return this.httpClient.client.post(`${this.namespace}/messages/readAll`, { chatId });
	}

	/**
	 * Read messages
	 * @param data read messages payload
	 */
	async readMessages({ chatId, messagesIds }: ReadMessagesRequest) {
		return this.httpClient.client.post(`${this.namespace}/messages/readMessages`, { chatId, messagesIds });
	}

	/**
	 * Pin message
	 * @param id message id
	 */
	async pinMessage(id: number) {
		return this.httpClient.client.post(`${this.namespace}/messages/${id}/pin`);
	}

	/**
	 * Unpin message
	 * @param id message id
	 */
	async unpinMessage(id: number) {
		return this.httpClient.client.post(`${this.namespace}/messages/${id}/unpin`);
	}

	/**
	 * Delete message
	 * @param id message id
	 */
	async deleteMessage(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/messages/${id}`);
	}

	/**
	 * Get message
	 * @param id message id
	 */
	async getMessage(id: number) {
		return this.httpClient.client.get(`${this.namespace}/messages/${id}`);
	}

	/**
	 * create widget
	 * @param data create widget payload
	 * @returns created widget data
	 */
	createWidget(data: ICreateWidgetData) {
		return this.httpClient.client.post(`${this.namespace}/widgets`, data);
	}

	/**
	 * create widget
	 * @param data create widget payload
	 * @returns created widget data
	 */
	getWidgets(limit?: number, page?: number) {
		return this.httpClient.client.get(`${this.namespace}/widgets`, { params: { limit, page } });
	}

	/**
	 * delete widget
	 * @param id widget id
	 */
	deleteWidgets(id: ICreateWidgetData['id']) {
		return this.httpClient.client.delete(`${this.namespace}/widgets/${id}`);
	}

	/**
	 * update widget
	 * @param data update widget payload
	 * @returns updated widget data
	 */
	updateWidget(data: ICreateWidgetData) {
		return this.httpClient.client.patch(`${this.namespace}/widgets/${data.id}`, data);
	}
}
