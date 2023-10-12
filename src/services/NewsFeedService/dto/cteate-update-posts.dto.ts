import { EntryType } from 'perf_hooks';

export interface FileInfoDto {
	id: number;
	entityType: EntryType[] | string;
	entityId: number;
	uploadId: string;
	originalFilename: string;
	lastModified: number;
	size: number;
	url: string;
}

export interface RecipientsPost {
	exclude?: {
		departmentsIds?: string[];
		usersIds?: string[];
	};
	include?: {
		departmentsIds?: string[];
		usersIds?: string[];
	};
}
