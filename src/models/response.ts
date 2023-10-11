export interface IResponseWithPagination<D> {
	data: D[];
	meta?: {
		total: number;
		page: number;
		list: number;
		lastPage?: number;
		perPage?: number;
	};
}

export interface IResponseWithMessage {
	status: boolean;
	message: string;
}
