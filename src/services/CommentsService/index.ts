import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { IComment, ICommentParams } from '../../models/comment';
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
	 * Get comments
	 * @returns list of comments
	 */
	getComments({ entityType, entityId, page, list, q, pinned, nextId, lastId }: ICommentParams) {
		return this.httpClient.client.get<IResponseWithMeta<IComment>>(`${this.namespace}/list_comments`, {
			params: { entityType, entityId, page, list, q, pinned, nextId, lastId },
		});
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
