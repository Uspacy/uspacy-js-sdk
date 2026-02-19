export interface IColumn {
	id: string;
	title: string;
	color: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	items: any;
	columnUniqueName: string;
	sort: number;
	afterId: string;
	total: number;
	kanbanStageId?: string;
}

export interface IColumns {
	[key: string]: IColumn;
}

export interface IStage {
	id: string;
	title: string;
	color: string;
	afterId: string;
	sort: number;
	group_id?: number;
}

export interface IStages {
	data: IStage[];
}
