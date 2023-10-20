export interface IReason {
	id: number;
	title: string;
	sort: number;
	funnel_id?: number;
}

export interface IReasons {
	SUCCESS: IReason[];
	FAIL: IReason[];
}

export interface IStage {
	id: number;
	title: string;
	stage_code: string;
	color: string;
	sort: number;
	system_stage: boolean;
	reasons: IReason[];
	funnel_id?: number;
}

export interface IStages {
	data: IStage[];
}
