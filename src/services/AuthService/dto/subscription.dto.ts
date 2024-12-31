export interface ISubscriptionsIndividual {
	payment_intent?: string;
	phone?: string;
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
	tax_id?: string;
	tariff_extension?: boolean;
}

export interface ISubscriptionsLegal {
	payment_intent?: string;
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
	tariff_extension?: boolean;
}

export interface IIntentPayload {
	amount: number;
	currency: string;
	payment_method: string;
}

export interface ICreatingIntentPayload {
	amount: number;
	currency: string;
	payment_method: string;
}

export interface ICreateUsingPaymentIntent {
	gatewayAccountId: string;
	gwToken: string;
	paymentMethodType: 'card' | 'bank_transfer';
}

// ! NEW BILLING
export interface ISubscriptionPayload {
	email: string;
	phone: string;
	plan_code: string;
	quantity: number;
	tariff_extension?: boolean;
}

export interface IIndividualPayload extends ISubscriptionPayload {
	first_name: string;
	last_name: string;
	auto_renewal: boolean;
}

export interface ILegalPayload extends ISubscriptionPayload {
	edruofop: string;
	name: string;
	full_name_organization: string;
	short_name_organization: string;
	director_pib: string;
	legal_address: string;
}
