import { AxiosResponse } from 'axios';
import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { ICallFillFieldsParams, ICallFillFieldsResponse } from '../../models/ai-fill-fields';
import { EMailTone } from '../../models/email';
import { IHomeGeneralData } from '../../models/home';

// The backend enforces a 120 s deadline; this axios timeout gives it a 5 s margin to respond.
const FILL_FIELDS_TIMEOUT_MS = 125000;

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

	/**
	 * Get home data
	 * @returns home data (X-Cache-Time header holds the cache generation time)
	 */
	async getHomeData(): Promise<AxiosResponse<{ data: IHomeGeneralData }>> {
		return this.httpClient.client.get(`${this.namespace}/main/desktop`);
	}

	/**
	 * Regenerate and get fresh home data
	 * @returns home data (X-Cache-Time header holds the cache generation time)
	 */
	async refreshHomeData(): Promise<AxiosResponse<{ data: IHomeGeneralData }>> {
		return this.httpClient.client.post(`${this.namespace}/main/refresh`);
	}

	/**
	 * Get AI suggestions for the fields of a CRM record from a call transcript (the call's "Заповнення полів" action)
	 * @param text the call transcript exactly as stored on the call (a formatted dialog)
	 * @param entityType the open record's CRM entity type (e.g. `leads`, `deals`, `contacts`, `companies`, or a custom entity name)
	 * @param entityId id of the open record
	 * @param callStartedAt call start time as RFC 3339 with offset (e.g. `2026-09-21T10:15:00+03:00`); without it, date fields are not suggested
	 * @param timeZone IANA time zone name for the call, used together with `callStartedAt`
	 * @returns suggested field values and evidence; a single-value field's value can be PATCHed as it is, while a
	 * multi-value field's suggestions are new entries to merge with the kept existing ones; on failure the promise
	 * rejects with the raw AxiosError, which `resolveCallFillFieldsErrorCode` maps to one `CallFillFieldsErrorCode`
	 */
	async getCallFillFields({
		text,
		entityType,
		entityId,
		callStartedAt,
		timeZone,
	}: ICallFillFieldsParams): Promise<{ data: ICallFillFieldsResponse }> {
		return this.httpClient.client.post(
			`${this.namespace}/crm/fill-fields`,
			{
				text,
				entity_type: entityType,
				entity_id: entityId,
				call_started_at: callStartedAt,
				time_zone: timeZone,
			},
			{ timeout: FILL_FIELDS_TIMEOUT_MS },
		);
	}
}
