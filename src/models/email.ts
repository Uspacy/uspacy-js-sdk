import { IEntityData } from './crm-entities';
import { IFile } from './files';

export type LetterStatus = 'pending' | 'error' | 'succseed';

export interface IThreads {
	email_id: number;
	filter: string[];
}

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
		name?: string;
	};
}

export interface IAttachments extends Pick<IFile, 'entityId' | 'entityType' | 'lastModified' | 'originalFilename' | 'size' | 'uploadId' | 'url'> {
	letterId: number;
	fileId: number;
	fileName: string;
}

export interface ICrmEntity {
	id: number;
	letter_id: number;
	table_id: number;
	title: string;
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
	email: IEmailBox;
	main_message_id?: string;
	is_first_reply?: boolean;
	thread_length?: number;
	status: LetterStatus;
	is_thread?: boolean;
	parent_message_id?: string;
	crm_entities: {
		companies: ICrmEntity[];
		contacts: ICrmEntity[];
		deals: ICrmEntity[];
		leads: ICrmEntity[];
	};
}

export interface IEmailBox {
	id: number;
	auth_user_id: number;
	portal_name: string;
	added_by: number;
	imap_host: string;
	imap_port: string;
	smtp_host: string;
	smtp_port: string;
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
	status_before?: string;
	created_at: string;
	updated_at: string;
	sync_freq: number;
	sync_folders?: IFolder[];
	folders?: IFolder[];
	crm_integration_enabled: number;
	oauth_provider?: string;
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
	q?: string;
}

export interface IEmailFiltersParams {
	page?: number;
	list?: number;
	date?: number[][];
	is_read?: number[];
	q?: string;
}

export enum ESettingName {
	INCOMING_NEW_ADDRESS = 'incoming_new_address',
	INCOMING_NEW_ADDRESS_SOURSE = 'incoming_new_address_source',
	INCOMING_NEW_ADDRESS_RESPONSIBLE = 'incoming_new_address_responsible',
	INCOMING_NEW_ADDRESS_RESPONSIBLE_TITLE = 'incoming_new_address_responsible_title',
	OUTGOING_NEW_ADDRESS = 'outgoing_new_address',
	OUTGOING_NEW_ADDRESS_SOURSE = 'outgoing_new_address_source',
	OUTGOING_NEW_ADDRESS_RESPONSIBLE = 'outgoing_new_address_responsible',
	OUTGOING_NEW_ADDRESS_RESPONSIBLE_TITLE = 'outgoing_new_address_responsible_title',
	INCOMING_EXISTING_ADDRESS = 'incoming_existing_address',
	INCOMING_EXISTING_ADDRESS_SOURSE = 'incoming_existing_address_source',
	INCOMING_EXISTING_ADDRESS_RESPONSIBLE = 'incoming_existing_address_responsible',
	INCOMING_EXISTING_ADDRESS_RESPONSIBLE_TITLE = 'incoming_existing_address_responsible_title',
}

export interface ICrmSetting {
	setting_name: ESettingName;
	setting_value: string | number;
}

export interface ILettersCrmEntities {
	contacts?: IEntityData[];
	companies?: IEntityData[];
	leads?: IEntityData[];
	deals?: IEntityData[];
}
