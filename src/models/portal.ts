export interface IPortal {
	id: number;
	portal_name: string;
	domain: string;
	ending_date: number;
	active: boolean;
	jwt_secret: string;
	s3_bucket: string;
	creator_ip: string;
}
