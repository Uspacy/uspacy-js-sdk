import { injectable } from 'tsyringe';

import { ConfigService } from '../../core/ConfigService';
import { HttpClient } from '../../core/HttpClient';
import { StorageService } from '../../core/StorageService';
import { INotificationMessage } from '../../models/notifications';

/**
 * Webhooks service
 */
@injectable()
export class NotificationsService {
	private namespace = '/notifications/v1/notifications';
	public storageService: StorageService;

	constructor(
		private httpClient: HttpClient,
		private configService: ConfigService,
	) {
		this.storageService = new StorageService('notifications', this.configService);
	}

	/**
	 * Get notifications
	 * @returns Array notifications
	 */
	getNotifications() {
		return this.httpClient.client.get<INotificationMessage[]>(this.namespace);
	}
}
