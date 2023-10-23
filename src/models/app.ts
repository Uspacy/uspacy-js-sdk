export interface IApp {
	id: number;
	name: string;
	code: string;
	short_description: string;
	description: string | null;
	instruction: string | null;
	tech_info: string | null;
	data_security: string | null;
	logo: string;
	active: boolean;
	paid: boolean;
	installed: boolean;
	price: null | boolean | number;
	developer_name: string;
	developer_link: string;
	integration_token: string;
}
