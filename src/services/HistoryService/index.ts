import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IHistoryChange, IHistoryRequest } from '../../models/history';
import { IResponseWithMeta } from '../../models/response';

/**
 * History service
 */
@injectable()
export class HistoryService {
	private namespace = '/history/v1';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get changes history list
	 * @returns Array history entity
	 */
	getChangesHistory({ service, entityTableName, id, page, list, action }: IHistoryRequest) {
		return this.httpClient.client.get<IResponseWithMeta<IHistoryChange[]>>(`${this.namespace}/${service}/${entityTableName}/${id}`, {
			params: {
				page,
				list,
				action,
			},
		});
	}
}
