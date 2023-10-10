import { injectable, registry } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { StorageService } from '../../core/StorageService';
import { INotificationMessage } from '../../models/notifications';

/**
 * Webhooks service
 */
@injectable()
@registry([
	{
		token: StorageService,
		useValue: new StorageService('notifications'),
	},
])
export class NotificationsService {
	private namespace = '/notifications/v1/notifications';

	constructor(
		private httpClient: HttpClient,
		public storageService: StorageService,
	) {}

	/**
	 * Get notifications
	 * @returns Array notifications
	 */
	getNotifications() {
		return this.httpClient.client.get<INotificationMessage[]>(this.namespace);
	}
}
