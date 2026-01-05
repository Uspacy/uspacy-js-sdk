export interface ICountry {
	title: string;
	code: string;
}

export interface ITariff {
	title: string;
	plan_code: string;
	price: string;
	currency: string;
	period_unit: string;
	period: number;
	active: boolean;
	region: string;
}

export interface IPortalSubscription {
	paid_users: number;
	plan_title: string;
	plan: string;
	plan_end: number;
	demo_activation: boolean;
	auto_renewal: boolean;
	first_payment_date: number;
	created_at: number;
	new_customer: boolean;
}

export interface IBill {
	email: string;
	portal: string;
	plan_code: string;
	quantity: number;
	region: string;
	phone: string;
	auto_renewal: boolean;
	url: string;
	sub_id: number;
	company: number;
	invoice_number: string;
	total_amount: number;
	first_name?: string;
	last_name?: string;
	contact?: number;
	edruofop?: string;
	name?: string;
	full_name_organization?: string;
	short_name_organization?: string;
	director_pib?: string;
	legal_address?: string;
	coupon?: string[];
	tax_id?: string;
	hash?: string;
}

export interface IDiscountCoupon {
	coupon_id: string;
	valid_from: string;
	valid_till: string;
	status: 'active' | 'not valid';
	discount_type: 'relative' | 'absolute';
	discount_percent: number;
	discount_amount: { currency: string; value: string };
}

export interface IStripeRedirect {
	url: string;
}

export interface IVatInfo {
	isValid: boolean;
	company_name: string;
	address: string;
	vatNumber: string;
}
