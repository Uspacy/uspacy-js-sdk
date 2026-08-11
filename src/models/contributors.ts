export type ContributorStatus = 'ok' | 'not_found' | 'forbidden';

export interface IContributor {
	status: ContributorStatus;
	portal_id: number;
	title: string;
	deleted_at: string | null;
	created_by: number;
	updated_by: number;
	active: boolean;
}

export type IContributorsLookupRequest = Record<string, number[]>;

export type IContributorsLookupResponse = Record<string, Record<string, IContributor>>;
