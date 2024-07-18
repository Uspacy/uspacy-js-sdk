export interface IColumnVisibility {
	[key: string]: boolean;
}

export interface IColumnSizes {
	[key: string]: number;
}

export interface ITaskColumnSettings {
	column_visibility: IColumnVisibility;
	column_sizes: IColumnSizes;
	column_ordering: string[];
}

export interface ITableSettings {
	[key: string]: ITaskColumnSettings;
}
