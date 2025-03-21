import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';

/**
 * Resources service
 */
@injectable()
export class ResourcesService {
	private namespace = '/resources/resources';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Create resource
	 * @param data resource data without id
	 * @returns resource entity
	 * */
	createResource<T>(data: Partial<T> & { type: 'form' | 'widget' }, domain?: string) {
		return this.httpClient.client.post<T>(`${!!domain ? `${domain}/` : ''}${this.namespace}`, data);
	}

	/**
	 * get resources list
	 * @param type resource type
	 * @returns resources list
	 * */
	getResources(type: 'form' | 'widget', domain?: string) {
		return this.httpClient.client.get(`${!!domain ? `${domain}/` : ''}${this.namespace}`, { params: { type } });
	}

	/**
	 * get resource by id
	 * @param id resource id
	 * @returns resource entity
	 * */
	getResourceById<T>(id: string, domain?: string) {
		return this.httpClient.client.get<T>(`${!!domain ? `${domain}/` : ''}${this.namespace}/${id}`);
	}

	/**
	 * delete resource
	 * @param id resource id
	 * @returns void
	 * */
	deleteResource(id: string, domain?: string) {
		return this.httpClient.client.delete(`${!!domain ? `${domain}/` : ''}${this.namespace}/${id}`);
	}

	/**
	 * update resource
	 * @param id resource id
	 * @param data resource data
	 * @returns resource entity
	 * */
	updateResource<T>(id: string, data: Partial<T> & { type: 'form' | 'widget' }, domain?: string) {
		return this.httpClient.client.patch<T>(`${!!domain ? `${domain}/` : ''}${this.namespace}/${id}`, data);
	}
}
