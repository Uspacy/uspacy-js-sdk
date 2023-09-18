/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IMassDeletion {
	taskIds: string[];
	exceptIds: number[];
	all: boolean;
	params?: any;
	withoutResponsible?: boolean;
}
