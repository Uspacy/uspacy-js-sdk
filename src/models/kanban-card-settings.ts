export interface IFieldSetting {
	id: string;
	fieldCode: string;
	active: boolean;
	sort: number;
}

export interface IStageSetting {
	stageId: number;
	fields: IFieldSetting[];
}

export interface IKanbanCardStagesSettings {
	stages: IStageSetting[];
}

export interface IKanbanCardSettings {
	id: string;
	data: Record<string, IKanbanCardStagesSettings>;
}
