/* eslint-disable camelcase */
import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IPost } from '../../models/newsfeed';
import { INotify } from '../../models/notify';
import { IResponseWithPagination } from '../../models/response';
import { createUpdatePostDto } from './dto/cteate-update-posts.dto';

/**
 * NewsFeed service
 */
@injectable()
export class NewsFeedService {
	private namespace = '/newsfeed/v1/posts';

	/**
	 * @param config http client
	 */
	constructor(private httpClient: HttpClient) {}

	/**
	 * Get posts list
	 * @param page current page
	 * @param list how many items should be per page
	 * @param group_id group id
	 * @returns post list
	 */
	getPosts(page: number, list?: number, group_id?: number | string) {
		return this.httpClient.client.get<IResponseWithPagination<IPost>>(`${this.namespace}`, { params: { page, list, group_id } });
	}

	/**
	 * Get posts by id
	 * @param id post id
	 * @returns post
	 */
	getPost(id: number) {
		return this.httpClient.client.get<IPost>(`${this.namespace}/:id/`, { urlParams: { id } });
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
	createPost(body: createUpdatePostDto) {
		return this.httpClient.client.post<IPost>(`${this.namespace}`, body);
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
	updatePost(id: string, body: createUpdatePostDto) {
		return this.httpClient.client.patch<IPost>(`${this.namespace}/:id`, body, { urlParams: { id } });
	}

	/**
	 * Delete post
	 * @param id post id
	 * @returns
	 */
	deletePost(id: string, notify?: INotify) {
		return this.httpClient.client.delete<IPost>(`${this.namespace}/:id`, { data: { notify }, urlParams: { id } });
	}
}
