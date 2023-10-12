import { AxiosInstance } from 'axios';

import { EmotionType } from '../../models/newsfeed';
import { INotify } from '../../models/notify';
import { IResponseWithPagination } from '../../models/response';
import { FileInfoDto, Post, RecipientsPost } from './dto/cteate-update-posts.dto';

/**
 * NewsFeed service
 */
export class NewsFeedService {
	private namespace = '/newsfeed/v1/posts';

	/**
	 * @param config http client
	 */
	constructor(private httpClient: AxiosInstance) {}

	/**
	 * Get posts list
	 * @param page current page
	 * @param list how many items should be per page
	 * @param groupId group id
	 * @returns post list
	 */
	getPosts(page: number, list?: number, groupId?: number) {
		return this.httpClient.get<IResponseWithPagination<Post>>(`${this.namespace}`, { params: { page, list, groupId } });
	}

	/**
	 * Get posts by id
	 * @param id post id
	 * @returns post
	 */
	getPost(id: number) {
		return this.httpClient.get<Post>(`${this.namespace}/:id/`, { urlParams: { id } });
	}

	/**
	 * Create post
	 * @param title title
	 * @param message message
	 * @param files files
	 * @param recipients RecipientsPost intarface
	 * @param fileIds Array of files ids
	 * @param authorMood Emotion type
	 * @param groupId Group id
	 * @param notify Notify
	 * @returns
	 */
	createPost(
		title: string,
		message: string,
		files?: FileInfoDto[],
		recipients?: RecipientsPost,
		fileIds?: number[],
		authorMood?: EmotionType | '',
		groupId?: number,
		notify?: INotify,
	) {
		return this.httpClient.post<Post>(`${this.namespace}`, {
			title,
			message,
			files,
			recipients,
			fileIds,
			authorMood,
			groupId,
			notify,
		});
	}

	/**
	 * Update post
	 * @param id post id
	 * @param title title
	 * @param message message
	 * @param files files
	 * @param recipients RecipientsPost intarface
	 * @param fileIds Array of files ids
	 * @param authorMood Emotion type
	 * @param groupId Group id
	 * @param notify Notify
	 * @returns
	 */
	updatePost(
		id: string,
		title: string,
		message: string,
		files?: FileInfoDto[],
		recipients?: RecipientsPost,
		fileIds?: number[],
		authorMood?: EmotionType | '',
		groupId?: number,
		notify?: INotify,
	) {
		return (
			this.httpClient.patch<Post>(`${this.namespace}/:id`),
			{
				title,
				message,
				files,
				recipients,
				fileIds,
				authorMood,
				groupId,
				notify,
			},
			{ urlParams: { id } }
		);
	}

	/**
	 * Delete post
	 * @param id post id
	 * @returns
	 */
	deletePost(id: string, notify?: INotify) {
		return this.httpClient.delete<Post>(`${this.namespace}/:id`, { data: { notify }, urlParams: { id } });
	}
}
