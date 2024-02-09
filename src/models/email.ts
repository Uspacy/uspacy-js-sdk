import { IFile } from './files';

export type LetterStatus = 'pending' | 'error' | 'succseed';
export interface IFolder {
	id?: number;
	email_id?: number;
	parent_id?: number;
	folder_name?: string;
	path?: string;
	delimitter?: string;
	message_count?: number;
	unread_message_count?: number;
	error_message_count?: number;
	is_inbox?: boolean;
	is_trash?: boolean;
	is_spam?: boolean;
	is_draft?: boolean;
	is_junk?: boolean;
	is_sent?: boolean;
	is_pending?: boolean;
	is_root?: boolean;
	has_children?: number;
	pivot?: {
		letter_id: number;
		email_folder_id: number;
	};
}

export interface IContacts {
	id: number;
	email_id: number;
	name: string;
	email: string;
	pivot: {
		letter_id: number;
		email_contact_id: number;
		contact_type: string;
	};
}

export interface IAttachments extends Pick<IFile, 'entityId' | 'entityType' | 'lastModified' | 'originalFilename' | 'size' | 'uploadId' | 'url'> {
	letterId: number;
	fileId: number;
	fileName: string;
}

export interface IImapMapping {
	letter_id?: number;
	message_id?: string;
	parent_message_id?: string;
}

export interface ILetter {
	id: number;
	uid: number;
	email_id: number;
	message_id: string;
	subject: string;
	body: string;
	body_html: string;
	date: number;
	is_read: boolean;
	contacts: IContacts[];
	folders: IFolder[];
	attachments: IAttachments[];
	imap_mapping: IImapMapping;
	email: IEmailBox;
	main_letter_id?: number;
	is_first_reply?: boolean;
	chain_length?: number;
	status: LetterStatus;
}

export interface IEmailBox {
	id: number;
	auth_user_id: number;
	portal_name: string;
	added_by: number;
	imap_host: string;
	imap_port: string;
	email: string;
	password: string;
	name: string;
	sender_name: string;
	access_level: string;
	last_message_id: number;
	tariff: number;
	has_file: boolean;
	last_synced_at: string;
	status: string;
	created_at: string;
	updated_at: string;
	sync_freq: number;
	sync_folders?: IFolder[];
	folders?: IFolder[];
}

export interface IFolders {
	data: IFolder[];
}

export interface ILetters {
	data: ILetter[];
	meta: {
		current_page: number;
		from: number;
		last_page: number;
		per_page: number;
		to: number;
		total: number;
	};
}

export interface IEmailBoxes {
	data: IEmailBox[];
}

export interface IEmailFilters {
	page?: number;
	list?: number;
	folderId?: number;
	date?: number[][];
	time_label_date?: string[];
	certainDateOrPeriod_date?: number[];
	openCalendar?: boolean;
	is_read?: number[];
}

export interface IEmailFiltersParams {
	page?: number;
	list?: number;
	date?: number[][];
	is_read?: number[];
}
