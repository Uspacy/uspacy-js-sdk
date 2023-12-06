export interface IFolder {
	id?: number;
	email_id?: number;
	folder_name?: string;
	path?: string;
	delimitter?: string;
	message_count?: number;
	is_inbox?: boolean;
	is_trash?: boolean;
	is_spam?: boolean;
	is_draft?: boolean;
	is_junk?: boolean;
	is_sent?: boolean;
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

export interface IAttachments {
	letter_id: number;
	file_id: number;
	file_url: string;
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
}

export interface IEmailBox {
	id: number;
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
	page: number;
	list: number;
	folderId: number;
}
