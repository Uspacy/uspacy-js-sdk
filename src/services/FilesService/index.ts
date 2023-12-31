import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IFiles, IFilesSize } from '../../models/files';
import { IResponseWithMeta } from '../../models/response';

/**
 * Files service
 */
@injectable()
export class FilesService {
	private namespace = '/files/v1';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get files list
	 * @returns Array files entity
	 */
	getFiles(entityId: string, entityType: string) {
		return this.httpClient.client.get<IResponseWithMeta<IFiles>>(`${this.namespace}/files/`, { params: { entityId, entityType } });
	}

	/**
	 * Get files sizes
	 * @returns
	 */
	getFilesSize() {
		return this.httpClient.client.get<IFilesSize>(`${this.namespace}/totals/size/`);
	}
}
