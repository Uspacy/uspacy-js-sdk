export interface IOAuthClient {
	clientId: string;
	name: string;
	grantTypes: string[];
	redirectUris: string[] | null;
	confidential: boolean;
	userId: number | null;
	domain: string | null;
	permissions: string[] | null;
	revoked: boolean;
	createdAt: string | number;
	updatedAt: string | number;
}

// The create response additionally includes the one-time plaintext secret.
export interface IOAuthClientWithSecret extends IOAuthClient {
	secret: string;
}

// A permission group for the FE granular selector.
export interface IOAuthPermissionGroup {
	key: string; // area.entity, e.g. 'crm.leads'
	title: string;
	entity: string; // area.entity
	section: string; // 'crm' | 'tasks' | 'smart_objects'
	actions: string[]; // ['create','view','edit','delete']
	permissionKeys: {
		create: string;
		view: string;
		edit: string;
		delete: string;
	};
}

// Laravel paginator (flat; camelCased keys), as returned under the response envelope's `data`.
export interface IOAuthClientsPaginator {
	currentPage: number;
	data: IOAuthClient[];
	lastPage: number;
	perPage: number;
	total: number;
	from: number;
	to: number;
}

// users-backend wraps every payload in this envelope.
export interface IApiEnvelope<T> {
	status: boolean;
	data: T;
}
