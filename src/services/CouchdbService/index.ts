import { injectable } from 'tsyringe';
import { v4 as uuid } from 'uuid';

import { HttpClient } from '../../core/HttpClient';
import { TokensService } from '../../core/TokensService';
import { ICouchItemData, ICouchQueryResponse } from '../../models/couchdb';

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
	 * @param fileds Fields to return
	 */
	async find<T = unknown>(databaseName: string) {
		const partinionKey = await this.getPartitionKey();
		return this.httpClient.client.post<ICouchQueryResponse<T>>(`${this.namespace}/${databaseName}/_find`, {
			selector: {
				_id: {
					$gt: partinionKey,
				},
			},
		});
	}

	/**
	 * Find data from database
	 * @param databaseName Database name
	 * @param fileds Fields to return
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
		return this.httpClient.client.post<ICouchItemData>(`${this.namespace}/${databaseName}`, {
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
		return this.httpClient.client.put<ICouchItemData>(`${this.namespace}/${databaseName}/${id}`, {
			...data,
			_rev: rev,
			_id: id,
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
