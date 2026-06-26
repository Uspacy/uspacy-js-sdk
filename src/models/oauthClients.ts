// NOTE: client fields are SNAKE_CASE — the raw shape from auth-service via
// users-backend (no response camelCase conversion is applied).
export interface IOAuthClient {
	client_id: string;
	name: string;
	grant_types: string[];
	redirect_uris: string[] | null;
	confidential: boolean;
	user_id: number | null;
	domain: string | null;
	permissions: string[] | null;
	revoked: boolean;
	created_at: string | number;
	updated_at: string | number;
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

// Laravel paginator (flat; snake_case keys), as returned under the response envelope's `data`.
export interface IOAuthClientsPaginator {
	current_page: number;
	data: IOAuthClient[];
	last_page: number;
	per_page: number;
	total: number;
	from: number;
	to: number;
}

// users-backend wraps every payload in this envelope.
export interface IApiEnvelope<T> {
	status: boolean;
	data: T;
}
