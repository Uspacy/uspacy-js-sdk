import { AxiosInstance } from 'axios';

/**
 * FilesService service
 */
export class FilesService {
	private namespace = 'files/v1/files';

	private routeAceessName = {
		BaseURL: `${this.namespace}`,
		getListTheFileInfoURL: (entityType: EntityType[], entityId: number): string =>
			`${this.routeAceessName.BaseURL}/?entity_type=${entityType}&entityId=${entityId}/`,
		uploadOneOrMoreFilesURL: (): string => `${this.routeAceessName.BaseURL}/`,
		showInfoAboutFileURL: (id: number): string => `${this.routeAceessName.BaseURL}/${id}`,
	};

	/**
	 * @param config http client
	 */
	constructor(private httpClient: AxiosInstance) {}

	/**
	 * Lists the file info
	 * @param entityType Entity type name
	 * @param entityId Entity ID of the file
	 * @returns
	 */
	getListTheFileInfo(entityType: EntityType[], entityId: number) {
		return this.httpClient.get<FileInfoDto>(`${this.routeAceessName.getListTheFileInfoURL(entityType, entityId)}`);
	}

	/**
	 * Upload one or more files
	 * @param files files
	 * @param entityType Entity type name
	 * @param entityId Entity ID of the file
	 * @returns
	 */
	uploadOneOrMoreFiles(files: string[], entityType: EntityType, entityId: number) {
		return this.httpClient.post<FileInfoDto>(`${this.routeAceessName.uploadOneOrMoreFilesURL()}`, {
			files,
			entityType,
			entityId,
		});
	}

	/**
	 * Shows the info about the file
	 * @param fileId fileid
	 * @returns
	 */
	showInfoAboutFile(fileId: number) {
		return this.httpClient.get<FileInfoDto>(`${this.routeAceessName.showInfoAboutFileURL(fileId)}`);
	}

	/**
	 * Update the entity_id for one file or a group of files
	 * @param fileId Numeric ID of the file to update or the UUID of the upload group
	 * @param entityId Entity ID of the file
	 * @returns
	 */
	updateEntityIdForFiles(fileId: number, entityId: number) {
		return this.httpClient.patch<FileInfoDto>(`${this.routeAceessName.showInfoAboutFileURL(fileId)}`, {
			entity_id: entityId,
		});
	}

	/**
	 * Removes the uploaded file and info about it
	 * @param fileId file id
	 * @returns
	 */
	removeFileAndInfo(fileId: number) {
		return this.httpClient.delete<FileInfoDto>(`${this.routeAceessName.showInfoAboutFileURL(fileId)}`);
	}
}

export enum EntityType {
	comment = 'comment',
	post = 'post',
	task = 'task',
}

export interface FileInfoDto {
	id: number;
	entityType: EntityType[];
	entityId: number;
	uploadId: string;
	originalFilename: string;
	lastModified: number;
	size: number;
	url: string;
}