import { IField } from './field';
import { IFile } from './files';
import { IMeta } from './response';

export enum TriggerEntities {
	LEADS = 'leads',
	DEALS = 'deals',
	CONTACTS = 'contacts',
	COMPANIES = 'companies',
	ACTIVITY = 'activity',
	TASKS = 'task',
	COMMENT = 'comment',
	POSTS = 'posts',
	EMAIL = 'email',
}

export enum EntityServices {
	CRM = 'crm',
	TASKS = 'tasks',
	COMMENTS = 'comments',
	NEWSFEED = 'newsfeed',
	ACTIVITIES = 'activities',
	EMAIL = 'email',
}

export interface ITrigger {
	id?: number;
	entity: TriggerEntities;
	action: string;
	service: EntityServices;
}

export interface ICondition {
	id?: number;
	field: IField;
	value: string[] | number[];
	logic: string;
}

export enum AutomationActionTypes {
	CREATE = 'create',
	FIELD_EDIT = 'fieldEdit',
	DELETE = 'delete',
	ADD_PRODUCTS = 'addProducts',
	DO_WEBHOOK = 'doWebhook',
	WAITING = 'pause',
	UPDATE = 'update',
}

export interface IFieldWithEntity extends IField {
	fieldEntity?: TriggerEntities;
	modifier?: string;
}

export enum WaitingActionUnits {
	SECONDS = 's',
	MINUTES = 'm',
	HOURS = 'h',
	DAYS = 'd',
	WEEKS = 'w',
	MONTHS = 'mh',
}

export enum WaitingActionTypes {
	PERIOD = 'period',
	DATE = 'date',
}

// export interface IAction extends IWaitingAction, IDoWebhookAction, IDeleteAction, IFieldChangeAction, ICreateAction {
// 	id?: number;
// 	action: AutomationActionTypes;
// 	entityIdRef: IFieldWithEntity | number;
// 	pending_folder_id?: string;
// }

export interface IWaitingAction {
	waitingType: WaitingActionTypes;
	periodValue: {
		number: number;
		unit: WaitingActionUnits;
	};
	dateValue: number | string;
	dateField: IFieldWithEntity;
}

export interface IDoWebhookAction {
	webhookLink: string;
}

export interface IDeleteAction {
	entity: TriggerEntities;
	service: EntityServices;
	entityIdRef: IFieldWithEntity;
}

export interface IFieldChange {
	field: IField;
	value: IFieldChangeValueItem[] | IFieldChangeValueItem | IFieldChangeEmailBody;
}

export enum FieldChangeValueTypes {
	TEXT = 'text',
	MARKDOWN = 'markdown',
	ENTITY_FIELD = 'entityField',
	EMAIL = 'email',
	PHONE = 'phone',
	SOCIAL = 'social',
	USER = 'user_id',
	BOOLEAN = 'boolean',
	LIST = 'list',
	LABEL = 'label',
	MONEY = 'money',
	STAGE = 'stage',
	REASON = 'reason',
	DATETIME = 'datetime',
	DYNAMIC_DATETIME = 'dynamic_datetime',
	ENTITY_REFERENCE = 'entity_reference',
	TASKS = 'task',
	GROUP = 'group',
	AUTHOR_MOOD = 'author_mood',
	ENTITY_TYPE = 'entity_type',
	STATUS = 'status',
	PRIORITY = 'priority',
	EMAIL_SENDER = 'email_sender',
	MATH_OPERATION = 'math_operation',
}

export interface IFieldChangeValueItem {
	id: string;
	type: FieldChangeValueTypes;
	value: any;
}

export interface IFieldChangeEmailBody {
	value: string;
	attachments: number[];
	files: IFile[];
}

export interface IFieldChangeAction {
	entity: TriggerEntities;
	service: EntityServices;
	entityIdRef: IFieldWithEntity;
	body: IFieldChange[];
}

export interface ICreateAction {
	entity: TriggerEntities;
	service: EntityServices;
	body: IFieldChange[];
}

export enum NodeType {
	trigger = 'trigger',
	action = 'action',
	condition = 'condition',
	newItem = 'newItem',
	mainCondition = 'mainCondition',
	closeMainCondition = 'closeMainCondition',
}

export type ComponentData = {
	value?: number;
	type?: NodeType;
	description?: string;
	name?: string;
	mainConditionId?: string;
	order?: number;
	fromParentId?: string;
	isChildConditionOfMain?: boolean;
	entity?: string;
	actionType?: string;
};

export interface IWorkflow {
	id?: number;
	portal_id: number;
	title: string;
	active: boolean;
	description: string;
	automations_data: {
		trigger: ITrigger;
		conditions: {
			node_id: string;
			condition: ICondition[];
		}[];
		actions: {
			node_id: string;
			action: any; // IACTION
		}[];
	};
	created_at?: number;
	updated_at?: number;
	created_by?: number;
	updated_by?: number;
	nodes: any;
	edges: any;
	tree: any;
}

export interface IWorkflowsResponse {
	meta: IMeta;
	data: IWorkflow[];
}

export interface IWorkflowFilter {
	page: number;
	list: number;
	q: string;
	sortModel?: { [key: string]: string }[];
}
