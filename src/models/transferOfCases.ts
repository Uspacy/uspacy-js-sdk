export enum ETransferStatus {
	PROCESSING = 'processing',
	DONE = 'done',
}

export interface ITransferOfCasesProgress {
	status: ETransferStatus;
	totalQuantity: number;
	quantity: number;
	createdAt: number;
}

export interface ITransferTasksResponse {
	count: number;
	onlyQuantity: boolean;
	oldUserId: number;
	newUserIds: number[];
	ownersUsers: number[];
	responsibleUsers: number[];
	auditorsUsers: number[];
	accomplicesUsers: number[];
	templatesUsers: number[];
}

export interface ITransferGroupsResponse {
	count: number;
	onlyQuantity: boolean;
	oldUserId: number;
	newUserIds: number[];
	moderators: number[];
	group_owners: number[];
	group_members: boolean;
}

export interface ITransferActivitiesResponse {
	count: number;
	onlyQuantity: boolean;
	only_quantity: boolean;
	old_user_id: number;
	new_user_ids: number[];
	responsible_users: number[];
	participants_users: number[];
	calendar_sync: boolean;
}

export interface ITransferEntitiesResponse {
	count: number;
	onlyQuantity: boolean;
	only_quantity: boolean;
	old_user_id: number;
	new_user_ids: number[];
	call_user_ids: number[];
	entities_user_ids: {
		[key: string]: number[];
	};
}
