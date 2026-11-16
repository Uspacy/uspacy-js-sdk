export enum EMentionType {
	CUSTOM = 'custom',
	GROUP = 'group',
	DEPARTMENT = 'department',
}

export type EntityMentionType = EMentionType.GROUP | EMentionType.DEPARTMENT;

export interface IMention {
	id: string;
	name: string;
	type: EMentionType;
	/** group/department id for entity mentions, null for custom ones */
	entityId: number | null;
	users: number[];
	groups: number[];
	departments: number[];
	ownerId: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface IMentionQuota {
	custom: {
		/** null — unlimited */
		total: number | null;
		/** null — unlimited */
		left: number | null;
	};
	/** whether mentions for groups and departments are available on the tariff */
	entity: boolean;
}

/** Error codes returned by the mentions API */
export enum EMentionErrors {
	INVALID_NAME = 'mentionInvalidName',
	NAME_TAKEN = 'mentionNameTaken',
}
