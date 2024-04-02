import { IFolder } from '../../models/email';

export interface IConnectEmailBox {
	name?: string;
	sender_name?: string;
	email?: string;
	password?: string;
	imap_host?: string;
	imap_port?: string;
	sync_from?: {
		period?: '7 days' | '1 month' | '3 months' | '1 year';
	};
	access_level?: 'personal' | 'shared';
}

export interface IUpdateEmailBox extends IConnectEmailBox {
	folders: IFolder[];
	folders_remove?: number[];
}
