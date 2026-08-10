export interface IContributor {
	portal_id: number;
	title: string;
}

export type IContributorsLookupRequest = Record<string, number[]>;

export type IContributorsLookupResponse = Record<string, Record<string, IContributor>>;
