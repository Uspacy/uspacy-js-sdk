export interface IMassDeletion {
	taskIds: string[];
	exceptIds: number[];
	all: boolean;
	params?: string;
	withoutResponsible?: boolean;
}
