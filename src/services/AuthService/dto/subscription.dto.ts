export interface ISubscriptionPayload {
	email: string;
	phone: string;
	plan_code: string;
	quantity: number;
	auto_renewal: boolean;
	users_upgrade: boolean;
	coupons: string[];
}

export interface IIndividualPayload extends ISubscriptionPayload {
	first_name: string;
	last_name: string;
	url: string;
	data: string;
}

export interface ILegalPayload extends ISubscriptionPayload {
	edruofop: string;
}

export interface ILegalPayloadEu extends ISubscriptionPayload {
	registry_code: string;
	country: string;
	company_name: string;
	vat_number: string;
	region?: string;
}

export interface ISubscriptionStripePayload extends ISubscriptionPayload {
	first_name: string;
	last_name: string;
	url: string;
	success_url: string;
	cancel_url: string;
	country: string;
	data: string;
}
