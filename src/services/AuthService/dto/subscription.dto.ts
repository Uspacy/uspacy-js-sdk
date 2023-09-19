export interface ISubscriptionsIndividual {
	phone: string;
	email: string;
	first_name: string;
	last_name?: string;
	bind_card?: boolean;
	auto_debit?: boolean;
	quantity_employees: number;
	payment_method: string;
	rate_id: string;
	token: string;
	company_name: string;
	city: string;
	address_line1: string;
	address_line2: string;
	state: string;
	postal: string;
	country: string;
	coupon?: string[];
	processing?: boolean;
	url?: string;
	data?: string;
}

export interface ISubscriptionsLegal {
	firstName?: string;
	lastName?: string;
	email?: string;
	companyName?: string;
	country?: string;
	addressLine1?: string;
	addressLine2?: string;
	state?: string;
	city?: string;
	postal?: string;
	phone?: string;
	edrpou?: string;
	isFop?: boolean;
	company_name?: string;
	address_line1?: string;
	address_line2?: string;
	quantity_employees?: number;
	first_name?: string;
	last_name?: string;
	rate_id?: string;
	auto_debit?: boolean;
	token?: string;
	coupon?: string[];
	tax_id?: string;
}

export interface IIntentPayload {
	amount: number;
	currency: string;
	payment_method: string;
}
