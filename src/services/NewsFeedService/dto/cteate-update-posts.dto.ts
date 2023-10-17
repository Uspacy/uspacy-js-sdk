import { EntryType } from 'perf_hooks';

import { EmotionType } from '../../../models/newsfeed';
import { INotify } from '../../../models/notify';

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

export interface createUpdatePostDto {
	title: string;
	message: string;
	files?: FileInfoDto[];
	recipients?: RecipientsPost;
	file_ids?: number[];
	author_mood?: EmotionType | '';
	group_id?: number;
	notify?: INotify;
}
