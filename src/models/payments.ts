export interface IPrice {
	[key: string]: number;
}

export interface IDiscounts {
	type: 'percentage' | 'amount';
	value: number;
}

export interface IIndividualPersonForm {
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
}

export interface ILegalEntityForm {
	contactPersonPhone: string;
	contactPersonEmail: string;
	itinCode: string;
}

export interface IIndividualPersonFormEu {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
}

export interface ILegalEntityFormEu {
	firstName?: string;
	email: string;
	registryCode: string;
	country: string;
	vatNumber?: string;
}

export interface IIndividualPersonFormErrors {
	firstNameErr: boolean;
	lastNameErr: boolean;
	phoneErr: boolean;
	emailErr: boolean;
}

export interface ILegalEntityFormErrors {
	contactPersonPhoneErr: boolean;
	contactPersonEmailErr: boolean;
	itinCodeErr: boolean;
}

export interface IIndividualPersonFormErrorsEu {
	firstNameErr: boolean;
	lastNameErr: boolean;
	emailErr: boolean;
	phoneErr: boolean;
}

export interface ILegalEntityFormErrorsEu {
	firstNameErr?: boolean;
	emailErr: boolean;
	registryCodeErr: boolean;
	countryErr: boolean;
	vatNumberErr?: boolean;
}
