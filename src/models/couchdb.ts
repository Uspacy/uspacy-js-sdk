import PouchDB from 'pouchdb';

export type ICouchItemData<T = unknown> = T & {
	_id: string;
	type: string;
	_rev?: string;
	_deleted?: boolean;
};

export interface ICreateCouchItemResponse {
	ok: boolean;
	id: string;
	rev?: string;
}

export interface ICouchQueryResponse<F = unknown> {
	docs: ICouchItemData<F>[];
}

export interface ICouchFindResponse<T> {
	docs: ICouchItemData<T>[];
	warning?: string;
	[key: string]: unknown;
}

export interface IPouchSyncResponse<T> extends PouchDB.Replication.SyncResult<T> {}
export interface IPouchReplicationResponse<T> extends PouchDB.Replication.ReplicationResult<T> {}
