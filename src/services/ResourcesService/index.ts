import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { getResourcesDomain } from '../../helpers';
import { ResourceType } from '../../models/resources';

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
	createResource<T>(data: Partial<T> & { type: ResourceType }) {
		return this.httpClient.client.post<T>(`${getResourcesDomain(data.type)}/${this.namespace}`, data);
	}

	/**
	 * get resources list
	 * @param type resource type
	 * @returns resources list
	 * */
	getResources(type: ResourceType) {
		return this.httpClient.client.get(`${getResourcesDomain(type)}/${this.namespace}`, { params: { type } });
	}

	/**
	 * get resource by id
	 * @param id resource id
	 * @returns resource entity
	 * */
	getResourceById<T>(id: string, type: ResourceType) {
		return this.httpClient.client.get<T>(`${getResourcesDomain(type)}/${this.namespace}/${id}`);
	}

	/**
	 * delete resource
	 * @param id resource id
	 * @returns void
	 * */
	deleteResource(id: string, type: ResourceType) {
		return this.httpClient.client.delete(`${getResourcesDomain(type)}/${this.namespace}/${id}`);
	}

	/**
	 * update resource
	 * @param id resource id
	 * @param data resource data
	 * @returns resource entity
	 * */
	updateResource<T>(id: string, data: Partial<T> & { type: ResourceType }) {
		return this.httpClient.client.patch<T>(`${getResourcesDomain(data.type)}/${this.namespace}/${id}`, data);
	}
}
