export interface ICardBlock {
	id: string;
	title: string;
	sort: number;
	show: boolean;
	defaultBlock?: boolean;
	unhideable?: boolean;
	fields: {
		code: string;
		sort: number;
		showOnlyFilled: boolean;
	}[];
}

export interface ICardCustomizationMode {
	enabled: boolean;
	changes: ICardBlock[];
}
