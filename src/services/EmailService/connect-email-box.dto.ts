import { IFolder } from '../../models/email';

export interface IConnectEmailBox {
	name?: string;
	sender_name?: string;
	email?: string;
	password?: string;
	imap_host?: string;
	imap_port?: string;
	smtp_host?: string;
	smtp_port?: string;
	sync_from?: {
		period?: '7 days' | '1 month' | '3 months' | '1 year';
	};
	access_level?: 'personal' | 'shared';
	crm_integration_enabled?: boolean;
}

export interface IUpdateEmailBox extends IConnectEmailBox {
	folders: IFolder[];
	folders_remove?: number[];
}
