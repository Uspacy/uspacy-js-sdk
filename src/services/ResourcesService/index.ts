import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';

/**
 * Resources service
 */
@injectable()
export class ResourcesService {
	private namespace = '/resources/v1/resources';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Create resource
	 * @param data resource data without id
	 * @returns resource entity
	 * */
	createResource<T>(data: Partial<T> & { type: 'form' | 'widget' }) {
		return this.httpClient.client.post<T>(this.namespace, data);
	}

	/**
	 * get resources list
	 * @param type resource type
	 * @returns resources list
	 * */
	getResources(type: 'form' | 'widget') {
		return this.httpClient.client.get(this.namespace, { params: { type } });
	}

	/**
	 * delete resource
	 * @param id resource id
	 * @returns void
	 * */
	deleteResource(id: string) {
		return this.httpClient.client.delete(`${this.namespace}/${id}`);
	}
}
