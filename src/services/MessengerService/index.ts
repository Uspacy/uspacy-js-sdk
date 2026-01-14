import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import {
	FetchMessagesRequest,
	GoToMessageRequest,
	IChat,
	ICreateQuickAnswerDTO,
	ICreateWidgetData,
	IGetQuickAnswerParams,
	IQuickAnswer,
} from '../../models/messenger';

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
	async getChats(props: { type?: 'EXTERNAL'; all?: boolean; include?: string; page?: number; list?: number }) {
		return this.httpClient.client.get<IChat[]>(`${this.namespace}/chats`, {
			params: { ...props },
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
	async getMessages(props: FetchMessagesRequest) {
		return this.httpClient.client.get(`${this.namespace}/messages/`, {
			params: { ...props },
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

	/**
	 * readAllMessages
	 * @param chatId chat id
	 */
	async readAllMessages(chatId: IChat['id']) {
		return this.httpClient.client.post(`${this.namespace}/messages/readAll/`, { chatId });
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

	/**
	 * get quick answers
	 * @returns list of quick answers
	 */
	getQuickAnswers(reqParams: IGetQuickAnswerParams) {
		return this.httpClient.client.get(`${this.namespace}/quick-replies`, {
			params: { ...reqParams },
		});
	}

	/**
	 * get quick answer by id
	 * @returns quick answer
	 */
	getQuickAnswerById(id: string): Promise<{ data: IQuickAnswer }> {
		return this.httpClient.client.get(`${this.namespace}/quick-replies/${id}`);
	}

	/**
	 * create quick answer
	 * @returns created quick answer
	 */
	createQuickAnswer(data: ICreateQuickAnswerDTO) {
		return this.httpClient.client.post(`${this.namespace}/quick-replies`, data);
	}

	/**
	 * update quick answer
	 * @returns updated quick answer
	 */
	updateQuickAnswer(id: string, data: Partial<IQuickAnswer>): Promise<{ data: IQuickAnswer }> {
		return this.httpClient.client.patch(`${this.namespace}/quick-replies/${id}`, data);
	}

	/**
	 * update status
	 * @returns updated quick answer
	 */
	updateQuickAnswerStatus(id: string, status: string): Promise<{ data: IQuickAnswer }> {
		return this.httpClient.client.patch(`${this.namespace}/quick-replies/${id}/status/${status}`);
	}

	/**
	 * delete quick answer
	 */
	deleteQuickAnswer(id: string) {
		return this.httpClient.client.delete(`${this.namespace}/quick-replies/${id}`);
	}
}
