import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IAnalyticReport, IAnalyticReportList } from '../../models/analytics';

/**
 * Messenger service
 */
@injectable()
export class AnalyticsService {
	private namespace = 'analytics-backend/v1';
	constructor(private readonly httpClient: HttpClient) {}

	/**
	 * Get analytics report with filters
	 * @param params analytics report list filter params
	 * @param signal AbortSignal for cancelling request
	 * @returns Array analytics report list
	 */
	getAnalyticsReportList(params: string, signal: AbortSignal) {
		return this.httpClient.client.get<IAnalyticReportList>(`${this.namespace}?${params}`, {
			signal: signal,
		});
	}

	/**
	 * Create analytic report
	 * @param data analytic report data without id
	 * @returns report
	 * */
	createReport(data: Partial<IAnalyticReport>) {
		return this.httpClient.client.post<IAnalyticReport>(this.namespace, data);
	}

	/**
	 * Update analytic report
	 * @param id analytic report id
	 * @param data analytic report data
	 * @returns report
	 */
	updateReport(id: number, data: Partial<IAnalyticReport>) {
		return this.httpClient.client.patch<IAnalyticReport>(`${this.namespace}/:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Delete lead
	 * @param id analytic report id
	 */
	deleteReport(id: number) {
		return this.httpClient.client.delete<IAnalyticReport>(`${this.namespace}/:id`, {
			urlParams: { id },
		});
	}
}
