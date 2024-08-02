export interface IColumnVisibility {
	[key: string]: boolean;
}

export interface IColumnSizes {
	[key: string]: number;
}

export interface IColumnSorting {
	id: string;
	sort: string;
}

export interface ITaskColumnSettings {
	column_visibility: IColumnVisibility;
	column_sizes: IColumnSizes;
	column_ordering: string[];
	column_sorting: IColumnSorting[];
}

export interface ITableSettings {
	[key: string]: ITaskColumnSettings;
}
