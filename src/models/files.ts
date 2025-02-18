export interface IFilesSize {
	data: {
		size: number;
		limit: number;
	};
}

export interface IFile {
	id: number;
	entityId: number;
	entityType: string;
	lastModified: number;
	originalFilename: string;
	size: number;
	uploadId: string;
	url: string;
	creatorId: number;
	width: number;
	height: number;
}

export interface IFiles {
	data: IFile[];
}
