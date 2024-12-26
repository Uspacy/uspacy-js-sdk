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
	 * @returns comment entity
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

	/**
	 * pin comments
	 * @param id comment id
	 * @param pinned comment pinned flag
	 * @returns comment entity
	 */

	pinComment(id: number, pinned: boolean) {
		return this.httpClient.client.patch(`${this.namespace}/comments/:id/pin`, { pinned }, { urlParams: { id } });
	}
}
