import { EntryType } from 'perf_hooks';

export interface Post {
	id: string;
	title: string;
	message: string;
	authorId: string;
	files?: FileInfoDto[];
	date?: number;
	comments?: Comment[];
	recipients?: RecipientsPost;
	reactions?: {
		reaction: number;
		amount: number;
		entityId: number;
	}[];
}

export interface FileInfoDto {
	id: number;
	entityType: EntryType[];
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
