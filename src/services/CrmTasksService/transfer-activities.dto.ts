export interface ITransferActivitiesDto {
	old_user_id: number;
	new_user_ids: number[];
	responsible_users: number[];
	participants_users: number[];
	calendar_sync: boolean;
}
