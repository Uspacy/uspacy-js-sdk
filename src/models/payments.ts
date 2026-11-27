export enum EOperationType {
	BUY_A_NEW_TARIFF = 'buyANewTariff',
	RENEW_SUBSCRIPTION = 'renewSubscription',
	SWITCH_TO_PROFESSIONAL_TARIFF = 'switchToProfessionalTariff',
	SWITCH_TO_YEARLY_TARIFF = 'switchToYearlyTariff',
	CHANGE_USERS_COUNT = 'changeUsersCount',
	CHANGE_TARIFF = 'changeTariff',
	BUY_AN_EMAIL_PACKAGE = 'buyAnEmailPackage',
}

export enum ETariffType {
	FREE = 'free',
	STANDARD = 'standard',
	PROFESSIONAL = 'professional',
	PARTNER = 'partner',
	DEMO = 'demo',
	USPACY_TIER_1 = 'uspacy_tier1',
	USPACY_TIER_2 = 'uspacy_tier2',
	USPACY_TIER_3 = 'uspacy_tier3',
	USPACY_TIER_4 = 'uspacy_tier4',
}

export enum ETariffDuration {
	MONTHLY = 'monthly',
	YEARLY = 'yearly',
}

export enum EEmailPackageType {
	MAIL_10 = 'mail_10',
	MAIL_100 = 'mail_100',
}

export enum ETypeOfPayer {
	INDIVIDUAL = 'individual',
	LEGAL_ENTITY_INDIVIDUAL_ENTREPRENEUR = 'legalEntityIndividualEntrepreneur',
}

export enum EPaymentMethod {
	CARD = 'card',
	BANK_TRANSFER = 'bank_transfer',
}

export interface ITariff {
	type: ETariffType;
	duration: ETariffDuration;
	usersCount: number;
}

export interface IEmailPackage {
	type: EEmailPackageType;
	packagesCount: number;
}

export interface IIndividualForm {
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	country: string;
}

export interface IIndividualFormErr {
	firstName: boolean;
	lastName: boolean;
	phone: boolean;
	email: boolean;
	country: boolean;
}

export interface IIndividualFormUa {
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
}

export interface IIndividualFormUaErr {
	firstName: boolean;
	lastName: boolean;
	phone: boolean;
	email: boolean;
}

export interface ILegalForm {
	email?: string;
	phone?: string;
	registryCode: string;
	companyName: string;
	country: string;
	vatNumber?: string;
}

export interface ILegalFormErr {
	email?: boolean;
	phone?: boolean;
	registryCode: boolean;
	companyName: boolean;
	country: boolean;
	vatNumber?: boolean;
}

export interface ILegalFormUa {
	contactPersonPhone: string;
	contactPersonEmail: string;
	itinCode: string;
	edoEmail: string;
}

export interface ILegalFormUaErr {
	contactPersonPhone: boolean;
	contactPersonEmail: boolean;
	itinCode: boolean;
	edoEmail: boolean;
}

export interface IDiscounts {
	type: 'percentage' | 'amount';
	value: number;
}
