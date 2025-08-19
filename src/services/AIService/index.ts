import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';

/**
 * AI service
 */
@injectable()
export class AIService {
	private namespace = '/ai-backend/v1';
	constructor(private readonly httpClient: HttpClient) {}

	/**
	 * Get messages summary
	 * @param text string by format: `${author?.firstName} ${author?.lastName}: ${message}\n${nextMessageData}`
	 * @returns messages summary
	 */
	async getMessagesSummary({ text }: { text?: string }): Promise<{ data: { summary: string } }> {
		return this.httpClient.client.post(`${this.namespace}/summarize/`, { text });
	}

	/**
	 * Get task title and description by messages
	 * @param text string by format: `${author?.firstName} ${author?.lastName}: ${message}\n${nextMessageData}`
	 * @returns task title and description
	 */
	async getTaskByMessages({ text }: { text?: string }): Promise<{ data: { title: string; description: string } }> {
		return this.httpClient.client.post(`${this.namespace}/tasks/create`, { chat_messages: text });
	}
}
