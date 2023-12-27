import { IImapMapping } from '../../models/email';

export interface IContactsForCreateLetter {
	email?: string;
	name?: string;
	contact_type?: string;
}

export interface IAttachmentsForCreateLetter {
	file_id: number;
	file_name: string;
	file_url: string;
	creator_id: number;
	entity_type: string;
	entity_id: number;
	upload_id: number;
	original_filename: string;
	last_modified: number;
	size: number;
}

export interface ICreateLetterPayload {
	subject?: string;
	body?: string;
	body_html?: string;
	contacts?: IContactsForCreateLetter[];
	attachments?: IAttachmentsForCreateLetter[];
	imap_mapping?: IImapMapping;
}
