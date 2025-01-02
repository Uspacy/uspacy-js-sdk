export interface ILineItems {
	id: string;
	date_from: number;
	date_to: number;
	unit_amount: number;
	quantity: number;
	amount: number;
	pricing_model: string;
	is_taxed: boolean;
	tax_amount: number;
	object: string;
	subscription_id: string;
	customer_id: string;
	description: string;
	entity_type: string;
	entity_id: string;
	tax_exempt_reason: string;
	discount_amount: number;
	item_level_discount_amount: number;
}

export interface IInvoiceData {
	id: string;
	po_number: string;
	customer_id: string;
	subscription_id: string;
	recurring: boolean;
	status: string;
	price_type: string;
	date: number;
	due_date: number;
	net_term_days: number;
	exchange_rate: number;
	total: number;
	amount_paid: number;
	amount_adjusted: number;
	write_off_amount: number;
	credits_applied: number;
	amount_due: number;
	updated_at: number;
	paid_at?: number;
	resource_version: number;
	deleted: boolean;
	object: string;
	first_invoice: boolean;
	amount_to_collect: number;
	round_off_amount: number;
	has_advance_charges: boolean;
	currency_code: string;
	base_currency_code: string;
	generated_at: number;
	is_gifted: boolean;
	term_finalized: boolean;
	channel: string;
	tax: number;
	sub_total: number;
	line_items: ILineItems[];
	external_id: string;
	hash: string;
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

export interface IInvoices {
	data: {
		offset: string[];
		invoices: IInvoiceData[];
	};
}

export interface SubscriptionItem {
	item_price_id: string;
	item_type: string;
	quantity: number;
	unit_price: number;
	amount: number;
	free_quantity: number;
	object: string;
}

export interface ISubscription {
	id: string;
	billing_period: number;
	billing_period_unit: string;
	customer_id: string;
	auto_collection: 'on' | 'off';
	auto_debit: boolean;
	status: string;
	current_term_start: number;
	current_term_end: number;
	next_billing_at: number;
	created_at: number;
	started_at: number;
	activated_at: number;
	updated_at: number;
	has_scheduled_changes: boolean;
	channel: string;
	resource_version: number;
	deleted: boolean;
	object: string;
	currency_code: string;
	subscription_items: SubscriptionItem[];
	due_invoices_count: number;
	mrr: number;
	exchange_rate: number;
	base_currency_code: string;
	cf_portal_domain: string;
	cf_legal_entity: string;
	cf_payment_method: string;
	has_scheduled_advance_invoices: boolean;
	override_relationship: boolean;
	demo_available: boolean;
	new_customer: boolean;
	cf_paid_users?: number;
}

export interface ICoupon {
	id: string;
	name: string;
	invoice_name: string;
	discount_type: string;
	discount_percentage?: number;
	discount_amount?: number;
	duration_type: string;
	status: string;
	apply_discount_on: string;
	apply_on: string;
	created_at: number;
	updated_at: number;
	resource_version: number;
	object: string;
	redemptions: number;
	valid_till: number;
	max_redemptions: number;
}

export interface IIntent {
	id: string;
	status: string;
	amount: number;
	gateway_account_id: string;
	expires_at: number;
	payment_method_type: string;
	created_at: number;
	modified_at: number;
	updated_at: number;
	resource_version: number;
	object: string;
	currency_code: string;
	gateway: string;
}

export interface IRatesListData {
	id: string;
	name: string;
	item_family_id: string;
	item_id: string;
	description: string;
	status: string;
	external_name: string;
	pricing_model: string;
	price: number;
	period: number;
	currency_code: string;
	period_unit: string;
	free_quantity: number;
	channel: string;
	resource_version: number;
	updated_at: number;
	created_at: number;
	is_taxable: boolean;
	metadata: string[];
	item_type: string;
	show_description_in_invoices: boolean;
	show_description_in_quotes: boolean;
	cf_free_tariff: string;
	cf_uspacy_tariff_id: number;
	object: string;
}

export interface IRatesList {
	data: IRatesListData[];
}

// ! NEW BILLING
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
