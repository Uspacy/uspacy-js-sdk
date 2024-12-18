import { ISignaturesEmails } from '../../models/email';

export interface ISignaturePayload {
	name: string;
	signature: string;
	is_all_emails: boolean;
	emails: ISignaturesEmails[];
}

export type ISignatureUpdatePayload = Partial<ISignaturePayload>;
