export interface ITransferEntitiesDto {
	old_user_id: number;
	new_user_ids: number[];
	call_user_ids: number[];
	entities_user_ids: {
		[key: string]: number[];
	};
}
