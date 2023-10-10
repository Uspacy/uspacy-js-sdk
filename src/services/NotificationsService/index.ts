import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { StorageService } from '../../core/StorageService';
import { INotificationMessage } from '../../models/notifications';

/**
 * Webhooks service
 */
@injectable()
export class NotificationsService {
	private namespace = '/notifications/v1/notifications';
	public storageService: StorageService = new StorageService('notifications');

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get notifications
	 * @returns Array notifications
	 */
	getNotifications() {
		return this.httpClient.client.get<INotificationMessage[]>(this.namespace);
	}
}
