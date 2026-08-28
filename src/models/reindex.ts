export enum EReindexStatus {
	Pending = 'pending',
	Running = 'running',
	Completed = 'completed',
	Failed = 'failed',
	Skipped = 'skipped',
}

export interface IReindexJob {
	id: number;
	domain: string;
	service: string;
	entity: string;
	namespace?: string;
	status: EReindexStatus;
	start_date: string;
	end_date?: string;
	reindex_items?: IReindexItem[];
}

export interface IReindexItem {
	id: number;
	job_id: number;
	domain: string;
	service: string;
	entity: string;
	status: EReindexStatus;
	start_date: string;
	end_date?: string;
	created_at: string;
	updated_at: string;
}
