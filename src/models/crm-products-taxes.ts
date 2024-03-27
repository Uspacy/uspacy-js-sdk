export interface ITax {
	id: number;
	name: string;
	rate: number;
	is_active: number;
	created_at: number;
	updated_at: number;
}

export interface ITaxes {
	data: ITax[];
}
