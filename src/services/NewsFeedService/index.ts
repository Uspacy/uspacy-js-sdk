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

	private routeAceessName = {
		BaseURL: `${this.namespace}`,
		getPostsURL: (page: number, list: number, groupId?: number): string =>
			`${this.routeAceessName.BaseURL}/?page=${page}&list=${list}&${groupId ? groupId : ''}/`,
		createPostURL: (): string => `${this.routeAceessName.BaseURL}/`,
		updatePostURL: (id: string): string => `${this.routeAceessName.BaseURL}/${id}/`,
		deletePostURL: (id: string): string => `${this.routeAceessName.BaseURL}/${id}/`,
		getPostById: (id: number): string => `${this.routeAceessName.BaseURL}/${id}/`,
	};

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
		return this.httpClient.get<IResponseWithPagination<Post>>(`${this.routeAceessName.getPostsURL(page, list, groupId)}`);
	}

	/**
	 * Get posts by id
	 * @param id post id
	 * @returns post
	 */
	getPost(id: number) {
		return this.httpClient.get<Post>(`${this.routeAceessName.getPostById}`, { urlParams: { id } });
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
		return this.httpClient.post<Post>(`${this.routeAceessName.createPostURL}`, {
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
			this.httpClient.patch<Post>(`${this.routeAceessName.updatePostURL(id)}`),
			{
				title,
				message,
				files,
				recipients,
				fileIds,
				authorMood,
				groupId,
				notify,
			}
		);
	}

	/**
	 * Delete post
	 * @param id post id
	 * @returns
	 */
	deletePost(id: string, notify?: INotify) {
		return this.httpClient.delete<Post>(`${this.routeAceessName.deletePostURL(id)}`, { data: { notify } });
	}
}
