import { IEvent, IPermission } from '../../../models/webhooks';

export interface IWebhookRequest {
	url: string;
	active: boolean;
	events: IEvent[];
	name?: string;
	permissions?: IPermission[];
}
