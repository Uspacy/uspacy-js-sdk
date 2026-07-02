export type ReindexJobStatus = 'pending' | 'running' | 'completed' | 'failed';
export type ReindexItemStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export interface IReindexJob {
	id: number;
	domain: string;
	service: string;
	entity: string;
	namespace?: string;
	status: ReindexJobStatus;
	start_date: string;
	end_date?: string;
	reindex_items: IReindexItem[];
}

export interface IReindexItem {
	id: number;
	job_id: number;
	domain: string;
	service: string;
	entity: string;
	status: ReindexItemStatus;
	start_date: string;
	end_date?: string;
	created_at: string;
	updated_at: string;
}
