import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { EMailTone } from '../../models/email';

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
	async getMessagesSummary({ text }: { text: string }): Promise<{ data: { summary: string } }> {
		return this.httpClient.client.post(`${this.namespace}/summarize/`, { text });
	}

	/**
	 * Get task title and description by messages
	 * @param text string by format: `${author?.firstName} ${author?.lastName}: ${message}\n${nextMessageData}`
	 * @returns task title and description
	 */
	async getTaskByMessages({ text }: { text: string }): Promise<{ data: { title: string; description: string } }> {
		return this.httpClient.client.post(`${this.namespace}/tasks/create`, { chat_messages: text });
	}

	/**
	 * Get transcript for audio file
	 * @param audioUrl url for audio file
	 * @returns transcript text
	 */
	async getCallTranscribe({ audioUrl }: { audioUrl: string }): Promise<{ data: { transcript: string } }> {
		return this.httpClient.client.post(`${this.namespace}/transcribe/`, { audio_url: audioUrl });
	}

	/**
	 * Get summary for audio file
	 * @param text text audio file
	 * @returns summary text
	 */
	async getCallSummary({ text }: { text: string }): Promise<{ data: { summary: string } }> {
		return this.httpClient.client.post(`${this.namespace}/summarize/`, { text });
	}

	/**
	 * Get email follow up
	 * @param text text audio file
	 * @returns summary text
	 */
	async getEmailFollowUp({ text, tone }: { text: string; tone: EMailTone }): Promise<{ data: { email_text: string; subject: string } }> {
		return this.httpClient.client.post(`${this.namespace}/email/followup/`, { text, tone });
	}
}
