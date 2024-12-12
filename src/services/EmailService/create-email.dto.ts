import { IEntityData } from '../../models/crm-entities';

export interface IContactsForCreateLetter {
	email?: string;
	name?: string;
	contact_type?: string;
}

export interface IAttachmentsForCreateLetter {
	file_id: number;
}

export interface ICreateLetterPayload {
	destination_folder_id?: number;
	main_message_id?: string;
	subject?: string;
	body?: string;
	body_html?: string;
	is_read?: boolean;
	contacts?: IContactsForCreateLetter[];
	attachments?: IAttachmentsForCreateLetter[];
	message_id?: string;
	parent_message_id?: string;
	crm_entities?: {
		[key: string]: IEntityData[];
	};
	signature_id?: number;
}
