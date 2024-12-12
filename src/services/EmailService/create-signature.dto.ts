import { ISignaturesEmails } from '../../models/email';

export interface ICreateSignature {
	name?: string;
	signature?: string;
	is_all_emails?: boolean;
	emails?: ISignaturesEmails[];
}
