export interface IResponseWithMeta<D> {
	data: D[];
	meta: IMeta;
}

export interface IMeta {
	total: number;
	page: number;
	list: number;
	lastPage?: number;
	perPage?: number;
	last_page?: number;
}

export interface IResponseWithMessage {
	status: boolean;
	message: string;
}
