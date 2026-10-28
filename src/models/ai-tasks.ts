/**
 * AI action that rewrites a task description:
 * `fix` corrects spelling and grammar, `improve` rewrites for clarity, `shorten` makes it about half as long,
 * `continue` expands it into a complete description
 */
export type TaskDescriptionAIAction = 'fix' | 'improve' | 'shorten' | 'continue';

export interface ITaskDescriptionAIParams {
	action: TaskDescriptionAIAction;
	/** task title, used as context; `continue` works from the title alone when the body is empty */
	title?: string;
	/** task description as editor HTML */
	body: string;
}

/** `unchanged` and `updated` are existing items, `new` items are to be added */
export type TaskChecklistAIItemStatus = 'unchanged' | 'updated' | 'new';

export interface ITaskChecklistAIItem {
	/** id of an existing item; it is echoed back as is, so temporary ids of an unsaved task work too */
	id?: number | string;
	title: string;
}

export interface ITaskChecklistAISuggestion extends ITaskChecklistAIItem {
	status: TaskChecklistAIItemStatus;
}

export interface ITaskChecklistAIParams {
	title?: string;
	/** task description as editor HTML */
	body?: string;
	/** current items of the checklist being regenerated; empty for a new checklist */
	items?: ITaskChecklistAIItem[];
}
