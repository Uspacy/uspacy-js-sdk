/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IColumn {
	id: string;
	title: string;
	color: string;
	items: any;
	afterId?: string;
	stage_code?: StageCodes;
	columnUniqueName: string;
	sort: string | number;
	total?: number;
}

export interface IWords {
	showMore: string;
	showLess: string;
	replacingTheColorOfTheStage: string;
	selectTheColorFromTheListThatYouWantToApply: string;
	orChooseYourOwnColor: string;
	hexCode: string;
	code: string;
	cancel: string;
	saveChanges: string;
	areYouSureYouWantToDeleteAStage: string;
	dataAboutThisStepWillBeLost: string;
	yesDelete: string;
	theNameOfTheStageMustBeFilled: string;
	theNameOfTheStage: string;
	newStage: string;
	aStageCannotBeDeletedAsLongAsItContainsAtLeastOneObject: string;
	itIsNotPossibleToDeleteAStage: string;
	yesOfCourse: string;
	poorQualityIce: string;
	qualityIce: string;
	theDealFailed: string;
	theDealIsWon: string;
}

export interface IPlaceholderProps {
	clientY: number;
	clientX: number;
	clientWidth: number;
	clientHeight: number;
}

export interface IColumnHeaderEditingFunctions {
	handleColumnEditing: (column: IColumn) => void;
	handleDeleteStage: (column: IColumn) => void;
}

export interface IColumns {
	[key: string]: IColumn;
}

export interface IDnDItem {
	fromColumnId: string;
	toColumnId: string;
	cardId: string;
	// using for other kanban
	item: any;
	isDeleteFromColumn: boolean;
	isAddToColumn: boolean;
}

export enum StageCodes {
	NEW = 'NEW',
	SUCCESS = 'SUCCESS',
	FAIL = 'FAIL',
	IN_WORK = 'IN_WORK',
}
