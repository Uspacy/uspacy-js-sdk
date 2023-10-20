export enum NotificationAction {
	CREATE = 'create',
	UPDATE = 'update',
	DELETE = 'delete',
	UPDATE_STAGE = 'updateStage',
}

export interface INotificationMessage {
	id: string;
	topic: string;
	type: string;
	env: string;
	data: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		entity: any;
		user_id: number;
		service: string;
		timestamp: string;
		action: NotificationAction;
	};
}

export enum NotificationActions {
	SUBSCIRBE = 'subscribe',
	PUBLISH = 'publish',
}
