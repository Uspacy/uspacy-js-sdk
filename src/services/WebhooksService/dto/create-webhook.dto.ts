import { IEvent } from '../../../models/webhooks';

export interface IWebhookRequest {
	url: string;
	active: boolean;
	events: IEvent[];
}
