export interface IPrice {
	standard: number;
	professional: number;
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

export interface IIndividualPersonFormErrors {
	firstNameErr: boolean;
	lastNameErr: boolean;
	phoneErr: boolean;
	emailErr: boolean;
}

export interface ILegalEntityForm {
	contactPersonPhone: string;
	contactPersonEmail: string;
	itinCode: string;
	companyName: string;
	legalAddress: string;
	directorsFullName: string;
	token: string;
}

export interface ILegalEntityFormEuCom {
	firstName: string;
	lastName: string;
	email: string;
	companyName: string;
	vatIdTaxIdForCompaniesOnly: string;
	country: string;
	addressLine1: string;
	addressLine2: string;
	state: string;
	city: string;
	postalZipCode: string;
}

export interface ILegalEntityFormErrors {
	contactPersonPhoneErr: boolean;
	contactPersonEmailErr: boolean;
	itinCodeErr: boolean;
	companyNameErr: boolean;
	legalAddressErr: boolean;
	directorsFullNameErr: boolean;
}

export interface ILegalEntityFormEuComErrors {
	firstNameErr: boolean;
	lastNameErr: boolean;
	emailErr: boolean;
	countryErr: boolean;
	postalZipCodeErr: boolean;
	addressLine1Err: boolean;
	cityErr: boolean;
}

export interface ICardCheck {
	success: boolean;
	loading: boolean;
	error: string;
}
