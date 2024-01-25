import { IImapMapping } from '../../models/email';

export interface IContactsForCreateLetter {
	email?: string;
	name?: string;
	contact_type?: string;
}

export interface IAttachmentsForCreateLetter {
	file_id: number;
}

export interface ICreateLetterPayload {
	main_letter_id?: number;
	subject?: string;
	body?: string;
	body_html?: string;
	is_read?: boolean;
	contacts?: IContactsForCreateLetter[];
	attachments?: IAttachmentsForCreateLetter[];
	imap_mapping?: IImapMapping;
}
