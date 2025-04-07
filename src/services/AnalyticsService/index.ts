import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IAnalyticReport, IAnalyticReportFilter, IAnalyticReportList, IDashboard } from '../../models/analytics';

/**
 * Analytics service
 */
@injectable()
export class AnalyticsService {
	private namespace = 'analytics-backend/v1';
	private namespaceReports = `${this.namespace}/reports/`;
	private namespaceDashboards = `${this.namespace}/dashboards/`;
	constructor(private readonly httpClient: HttpClient) {}

	/**
	 * Get analytics report with filters
	 * @param params analytics report list filter params
	 * @param signal AbortSignal for cancelling request
	 * @returns Array analytics report list
	 */
	getAnalyticsReportList(params: IAnalyticReportFilter, signal: AbortSignal) {
		return this.httpClient.client.get<IAnalyticReportList>(`${this.namespaceReports}`, {
			params,
			signal: signal,
		});
	}

	/**
	 * Get analytic report
	 * @param id analytic report id
	 * @returns report
	 */
	getAnalyticReport(id: string) {
		return this.httpClient.client.get<IAnalyticReport>(`${this.namespaceReports}:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Create analytic report
	 * @param data analytic report data without id
	 * @returns report
	 * */
	createReport(data: Partial<IAnalyticReport>) {
		return this.httpClient.client.post<IAnalyticReport>(`${this.namespaceReports}`, data);
	}

	/**
	 * Update analytic report
	 * @param id analytic report id
	 * @param data analytic report data
	 * @returns report
	 */
	updateReport(id: string, data: Partial<IAnalyticReport>) {
		return this.httpClient.client.patch<IAnalyticReport>(`${this.namespaceReports}:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Delete analytic report
	 * @param id analytic report id
	 */
	deleteReport(id: string) {
		return this.httpClient.client.delete<IAnalyticReport>(`${this.namespaceReports}:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Get dashboards list
	 * @returns Array dashboards list
	 */
	getDashboardsLists() {
		return this.httpClient.client.get<IDashboard[]>(`${this.namespaceDashboards}`);
	}

	/**
	 * Get dashboard
	 * @param id dashboard id
	 * @returns dashboard
	 */
	getDashboard(id: string) {
		return this.httpClient.client.get<IDashboard>(`${this.namespaceDashboards}:id`, {
			urlParams: { id },
		});
	}

	/**
	 * Create dashboard
	 * @param data dashboard with required title
	 * @returns dashboard
	 * */
	createDashboard(data: Partial<IDashboard>) {
		return this.httpClient.client.post<IDashboard>(`${this.namespaceDashboards}`, data);
	}

	/**
	 * Update dashboard
	 * @param id dashboard id
	 * @param data dashboard data
	 * @returns dashboard
	 */
	updateDashboard(id: string, data: Partial<IDashboard>) {
		return this.httpClient.client.patch<IDashboard>(`${this.namespaceDashboards}:id`, data, {
			urlParams: { id },
		});
	}

	/**
	 * Delete dashboard
	 * @param id dashboard id
	 */
	deleteDashboard(id: string) {
		return this.httpClient.client.delete<IDashboard>(`${this.namespaceDashboards}:id`, {
			urlParams: { id },
		});
	}
}
