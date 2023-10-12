import { FileInfoDto, RecipientsPost } from '../services/NewsFeedService/dto/cteate-update-posts.dto';
import { IComment } from './comment';

export enum EmotionType {
	Happy = 'happy',
	Proud = 'proud',
	Thankful = 'thankful',
	Inspired = 'inspired',
	Excited = 'excited',
	Festive = 'festive',
	Worried = 'worried',
	Sad = 'sad',
	Angry = 'angry',
}

export interface IPost {
	id?: string;
	title?: string;
	message?: string;
	authorId?: string;
	author_mood?: EmotionType;
	files?: FileInfoDto[];
	date?: number;
	comments?: IComment[];
	recipients?: RecipientsPost;
	reactions?: {
		reaction: number;
		amount: number;
		entityId: number;
	}[];
}
