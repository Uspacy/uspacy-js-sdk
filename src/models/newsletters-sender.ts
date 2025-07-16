export interface ISender {
	id: number;
	name: string;
	nickname: string;
	email: string;
	default: boolean;
	reply_to_email: string;
	created_at: number;
	updated_at: number;
}
