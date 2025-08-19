export interface IDns {
	dkim: string;
	type: string;
	name: string;
	value: string;
	valid: boolean;
	reason?: string;
}

export interface IDomain {
	id: number;
	domain: string;
	confirmed: boolean;
	default: boolean;
	created_at: number;
	updated_at: number;
	dns: IDns[];
}
