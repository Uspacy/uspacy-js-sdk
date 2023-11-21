export interface IFolder {
	id: number;
	email_id: number;
	folder_name: string;
	path: string;
	delimitter: string;
	message_count: number;
	is_trash: number;
	is_spam: number;
	is_draft: number;
	is_junk: number;
	is_sent: number;
	has_children: number;
	pivot: {
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
