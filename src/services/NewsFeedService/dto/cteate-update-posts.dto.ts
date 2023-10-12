import { EntryType } from 'perf_hooks';

// import { IComment } from '../../../models/comment';
// import { EmotionType } from '../../../models/newsfeed';

// export interface Post {
// 	id?: string;
// 	title?: string;
// 	message?: string;
// 	authorId?: string;
// 	author_mood?: EmotionType;
// 	files?: FileInfoDto[];
// 	date?: number;
// 	comments?: IComment[];
// 	recipients?: RecipientsPost;
// 	reactions?: {
// 		reaction: number;
// 		amount: number;
// 		entityId: number;
// 	}[];
// }

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
