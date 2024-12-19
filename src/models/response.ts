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
	current_page?: number;
	currentPage?: number;
	from?: number;
	last_page?: number;
	per_page?: number;
	to?: number;
	numberOfUnread?: number;
	parentTotal?: number;
	unfiltered_total?: number;
}

export interface IResponseWithMessage {
	status: boolean;
	message: string;
}
