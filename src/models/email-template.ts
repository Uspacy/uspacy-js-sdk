export interface IEmailTemplate {
	id: number;
	title: string;
	created_by: number;
	changed_by: number;
	active: boolean;
	body: string;
	style: string;
	created_at: number;
	updated_at: number;
	user_ids: number[];
	sections: string[];
}
