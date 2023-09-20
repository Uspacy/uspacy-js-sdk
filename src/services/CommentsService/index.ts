import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { EntityType, IComment } from '../../models/comment';
import { IResponseWithPagination } from '../../models/response';

/**
 * Comments service
 */
@injectable()
export class CommentsService {
	private namespace = '/comments/v1/comments';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Get comments
	 * @returns list of comments
	 */
	getComments(entityType: EntityType, entityId: number, list?: number, childList?: number, nextId?: number, lastId?: number) {
		return this.httpClient.client.get<IResponseWithPagination<IComment[]>>(this.namespace, {
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
	 * Create comment
	 */
	createComment(entityType: string, entityId: number, message?: string) {
		return this.httpClient.client.post<IComment>(this.namespace, {
			entityType,
			entityId,
			message,
		});
	}

	/**
	 * Get comment by id
	 * @param id comment id
	 * @returns
	 */
	getCommentById(id: number) {
		return this.httpClient.client.get<IComment>(`${this.namespace}/:id/`, {
			urlParams: {
				id,
			},
		});
	}

	/**
	 * Update comment
	 * @param id comment id
	 * @param message message
	 * @returns
	 */
	updateComment(id: number, message: string) {
		return this.httpClient.client.patch<IComment>(`${this.namespace}/:id/`, { message }, { urlParams: { id } });
	}

	/**
	 * Delete comment
	 * @param id comment id
	 * @returns
	 */
	deleteComment(id: number) {
		return this.httpClient.client.delete(`${this.namespace}/:id/`, { urlParams: { id } });
	}

	/**
	 * Delete comments by entity
	 * @param entityType entity type
	 * @param entityId entity id
	 */
	deleteCommentsByEntity(entityType: number, entityId: EntityType) {
		return this.httpClient.client.delete(`${this.namespace}/`, { params: { entityType, entityId } });
	}
}
