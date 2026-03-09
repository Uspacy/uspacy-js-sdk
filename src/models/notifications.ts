/* eslint-disable @typescript-eslint/no-explicit-any */
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
	table_name: string;
}

export interface INotificationMessage {
	id: string;
	topic: string;
	type: string;
	env: string;
	read?: boolean;
	createdAt: number;
	data: {
		entity: any;
		root_parent: IRootParent;
		user_id: number;
		service: string;
		timestamp: string;
		action: NotificationAction;
		show: boolean;
		old_entity?: any;
	};
}

export enum NotificationActions {
	SUBSCIRBE = 'subscribe',
	PUBLISH = 'publish',
}
