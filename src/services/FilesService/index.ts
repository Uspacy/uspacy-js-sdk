import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IFiles, IFilesSize } from '../../models/files';
import { IResponseWithPagination } from '../../models/response';

/**
 * Files service
 */
@injectable()
export class FilesService {
	private namespace = '/files/v1/files';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get files list
	 * @returns Array files entity
	 */
	getFiles(entityId: string, entityType: string) {
		return this.httpClient.client.get<IResponseWithPagination<IFiles>>(this.namespace, { params: { entityId, entityType } });
	}

	/**
	 * Get files sizes
	 * @returns
	 */
	getFilesSize() {
		return this.httpClient.client.get<IFilesSize>(`${this.namespace}/totals/size/`);
	}
}
