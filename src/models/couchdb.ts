export type ICouchItemData<T = unknown> = T & {
	_id?: string;
	_rev?: string;
};

export interface ICreateCouchItemResponse {
	ok: boolean;
	id: string;
	rev?: string;
}

export interface ICouchQueryResponse<F = unknown> {
	docs: ICouchItemData<F>[];
}
