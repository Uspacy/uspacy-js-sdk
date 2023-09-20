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
}

export interface IStages {
	data: IStage[];
	meta: {
		currentPage: number;
		from: number;
		lastPage: number;
		perPage: number;
		to: number;
		total: number;
	};
}
