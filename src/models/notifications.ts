export enum NotificationAction {
	CREATE = 'create',
	UPDATE = 'update',
	DELETE = 'delete',
	UPDATE_STAGE = 'updateStage',
}

interface IRootParent {
	data: {
		title: string;
		id: string;
	};
	type: string;
	service: string;
}

export interface INotificationMessage {
	id: string;
	topic: string;
	type: string;
	env: string;
	read?: boolean;
	createdAt: number;
	data: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		entity: any;
		root_parent: IRootParent;
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
