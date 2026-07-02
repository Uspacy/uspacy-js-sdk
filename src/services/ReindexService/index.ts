import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { TokensService } from '../../core/TokensService';
import { IReindexItem, IReindexJob } from '../../models/reindex';
import { ICreateReindexJob } from './dto/create-reindex-job.dto';

/**
 * Reindex service
 */
@injectable()
export class ReindexService {
	private namespace = '/reindex/v1/jobs';

	constructor(
		private httpClient: HttpClient,
		private tokenService: TokensService,
	) {}

	/**
	 * Get reindex jobs
	 * @returns a list of all reindex jobs, sorted by start date (newest first).
	 */
	async getReindexJobs() {
		return this.httpClient.client.get<IReindexJob[]>(this.namespace);
	}

	/**
	 * Get reindex jobs details
	 * @param jobId the id of the job to get details for
	 * @returns full details for a specific job, including the status of individual domains (reindex items).
	 */
	async getReindexJobsDetails(jobId: number) {
		return this.httpClient.client.get<IReindexItem[]>(`${this.namespace}/:jobId`, { urlParams: { jobId } });
	}

	/**
	 * Create reindex job
	 * @param data job payload
	 * @returns job object
	 */
	async createReindexJob(data: ICreateReindexJob) {
		const domain = await this.tokenService.getDomain();
		return this.httpClient.client.post<IReindexJob>(this.namespace, { ...data, domain, entity: data?.entity ?? '*' });
	}

	/**
	 * Retry a failed reindex job
	 * @param jobId the id of the job to retry
	 * @returns a message indicating the job has been retried
	 */
	async retryJob(jobId: number) {
		return this.httpClient.client.post<{ message: string }>(`${this.namespace}/:jobId/retry`, { urlParams: { jobId } });
	}
}
