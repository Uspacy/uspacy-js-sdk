import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { EntityType, IComment, ICommentParams } from '../../models/comment';
import { IResponseWithMeta } from '../../models/response';
import { ICreateCommentDto } from './create-comment-dto';

/**
 * Comments service
 */
@injectable()
export class CommentsService {
	private namespace = '/comments/v1';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get old comments
	 * @returns old list of comments
	 */
	getComments(entityType: EntityType, entityId: number, list?: number, childList?: number, nextId?: number, lastId?: number) {
		return this.httpClient.client.get<IResponseWithMeta<IComment[]>>(this.namespace, {
			params: {
				entityType,
				entityId,
				list,
				childList,
				nextId,
				lastId,
			},
		});
	}

	/**
	 * Get comments
	 * @returns list of comments
	 */
	getCommentsList(params: ICommentParams) {
		return this.httpClient.client.get<IResponseWithMeta<IComment>>(`${this.namespace}/list_comments`, { params });
	}

	/**
	 * Get comment
	 * @returns comment entity
	 */
	getComment(id: number) {
		return this.httpClient.client.get<IComment>(`${this.namespace}/comments/:id/`, { urlParams: { id } });
	}

	/**
	 * Create comment
	 * @param body create comment params
	 * @returns comment entity
	 */
	createComment(body: ICreateCommentDto) {
		return this.httpClient.client.post<IComment>(`${this.namespace}/comments`, body);
	}

	/**
	 * Update comment
	 * @param id comment id
	 * @param body update comment params
	 * @returns
	 */
	updateComment(id: number, body: ICreateCommentDto) {
		return this.httpClient.client.patch<IComment>(`${this.namespace}/comments/:id/`, body, { urlParams: { id } });
	}

	/**
	 * Delete comment
	 * @param id comment id
	 * @returns
	 */
	deleteComment(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/comments/:id/`, { urlParams: { id } });
	}

	/**
	 * Read comments
	 * @param id comment id
	 * @returns
	 */
	readComments(commentIds: number[]) {
		return this.httpClient.client.post(`${this.namespace}/comments/read/`, { commentIds });
	}
}
