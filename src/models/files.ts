export interface IFile {
	id: number;
	entityId: number;
	entityType: string;
	lastModified: number;
	originalFilename: string;
	size: number;
	uploadId: string;
	url: string;
}
