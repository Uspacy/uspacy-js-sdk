import { IAttachments, IContacts, IImapMapping } from '../../models/email';

export interface ICreateLetterPayload {
	subject?: string;
	body?: string;
	body_html?: string;
	contacts?: IContacts[];
	attachments?: IAttachments[];
	imap_mapping?: IImapMapping;
}
