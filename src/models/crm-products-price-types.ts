export interface IPriceType {
	id: number;
	title: string;
	entity_code?: string;
	code?: string;
	sort: number;
	default: boolean;
	active: boolean;
}

export interface IPriceTypes {
	data: IPriceType[];
}
