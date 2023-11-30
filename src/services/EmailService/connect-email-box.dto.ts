export interface IConnectEmailBox {
	name?: string;
	sender_name?: string;
	email?: string;
	password?: string;
	imap_host?: string;
	sync_from: {
		period: string;
	};
	access_level: string;
}
