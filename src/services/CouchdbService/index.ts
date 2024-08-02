import { injectable } from 'tsyringe';
import { v4 as uuid } from 'uuid';

import { HttpClient } from '../../core/HttpClient';
import { TokensService } from '../../core/TokensService';
import { ICouchItemData, ICouchQueryResponse, ICreateCouchItemResponse } from '../../models/couchdb';

/**
 * Apps service
 */
@injectable()
export class CouchdbService {
	private namespace = 'https://couchdb.uspacy.tech';
	constructor(
		private readonly httpClient: HttpClient,
		private readonly tokenService: TokensService,
	) {}

	async getPartitionKey() {
		const docodedToken = await this.tokenService.decodeToken();
		return docodedToken.domain + '-' + docodedToken.id;
	}

	/**
	 * Find data from database
	 * @param databaseName Database name
	 * @param type non-required param for filtering items by somethings type, for example: tasks, templates, leads and etc
	 * @returns Array of items
	 */
	async find<T = unknown>(databaseName: string, type?: string) {
		const partinionKey = await this.getPartitionKey();
		return this.httpClient.client.post<ICouchQueryResponse<T>>(`${this.namespace}/${databaseName}/_find`, {
			selector: {
				_id: {
					$regex: partinionKey,
				},
				...(type && { type }),
			},
			limit: 1000,
			skip: 0,
		});
	}

	/**
	 * Find data from database
	 * @param databaseName Database name
	 * @param fields Fields to return
	 */
	async findById<T = unknown>(databaseName: string, id: string) {
		return this.httpClient.client.get<ICouchItemData<T>>(`${this.namespace}/${databaseName}/${id}`);
	}

	/**
	 * Create data in database
	 * @param databaseName Database name
	 * @param data Data to create
	 */
	async create(databaseName: string, data: object, salt: string = `:${uuid()}`) {
		const partinionKey = await this.getPartitionKey();
		return this.httpClient.client.post<ICreateCouchItemResponse>(`${this.namespace}/${databaseName}`, {
			_id: partinionKey + salt,
			...data,
		});
	}

	/**
	 * Update data in database
	 * @param databaseName Database name
	 * @param id Document id
	 * @param rev Document revision
	 * @param data Data to update
	 */
	async update(databaseName: string, id: string, rev: string, data: object) {
		return this.httpClient.client.put<ICreateCouchItemResponse>(`${this.namespace}/${databaseName}/${id}`, {
			...data,
			_rev: rev,
			_id: id,
		});
	}

	/**
	 * Bulk update data from database
	 * @param databaseName Database name
	 * @param data Data to update
	 * @returns Array of items
	 */
	async bulkUpdate(databaseName: string, data: object[]) {
		return this.httpClient.client.post<ICreateCouchItemResponse[]>(`${this.namespace}/${databaseName}/_bulk_docs`, {
			docs: data,
		});
	}

	/**
	 * Delete data from database
	 * @param databaseName Database name
	 * @param id Document id
	 * @param rev Document revision
	 */
	delete(databaseName: string, id: string, rev: string) {
		return this.httpClient.client.delete<ICouchItemData>(`${this.namespace}/${databaseName}/${id}`, {
			params: {
				rev,
			},
		});
	}
}
