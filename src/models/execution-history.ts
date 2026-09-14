import { ISmartFilters } from './smart-filters';

export type ExecutionHistoryType = 'workers' | 'processes';

export enum ExecutionStatuses {
	COMPLETED = 'completed',
	IN_PROGRESS = 'active',
	WAITING = 'pending',
	CANCELED = 'canceled',
	ERROR = 'failed',
}

export interface IExecutionTrigger {
	service: string;
	entity: string;
	action: string;
}

export interface IExecutionEntity {
	type: string;
	id: number;
	title?: string;
}

export interface IExecutionTimestamps {
	started_at: number;
	finished_at: number;
	next_action_at: number | null;
}

export interface IExecutionProgress {
	total: number;
	completed: number;
}

export interface IExecutionHistoryItem {
	execution_id: string;
	automation_id: number;
	portal_id: number;
	title: string;
	status: ExecutionStatuses;
	created_by: number;
	entity: IExecutionEntity;
	trigger: IExecutionTrigger;
	execution_timestamps: IExecutionTimestamps;
	execution_progress?: IExecutionProgress;
}

export interface IExecutionHistoryMeta {
	currentPage: number;
	from: number;
	lastPage: number;
	perPage: number;
	to: number;
	total: number;
}

export interface IExecutionHistoryResponse {
	status: boolean;
	message: string;
	error: string | null;
	meta: IExecutionHistoryMeta;
	data: IExecutionHistoryItem[];
}

export interface IExecutionHistoryParams {
	page?: number;
	list?: number;
	search?: string;
	status?: ExecutionStatuses[];
	created_by?: number[];
	trigger_entity?: string[];
	automation_id?: number[];
	started_at?: number[][];
	sort_by?: string;
	sort_order?: 'asc' | 'desc';
}

export interface IExecutionNode {
	id: number;
	node_id?: string;
	order?: number;
	type?: string;
	title?: string;
	description?: string;
	status?: string;
	result?: string;
	entity_type?: string;
	timestamps?: {
		scheduled_at?: number | string;
		executed_at?: number | string;
	};
	duration?: number;
	waiting_until?: number | string;
}

export interface IProcessSnapshotNode {
	id: string;
	type: string;
	data?: Record<string, unknown>;
	position?: {
		x: number;
		y: number;
	};
	children?: IProcessSnapshotNode[];
}

export interface IProcessSnapshotAction {
	node_id: string;
	action?: {
		actionOrder?: number;
		action?: string;
		entity?: string;
		service?: string;
		body?: string;
	};
}

export interface IProcessSnapshotCondition {
	node_id: string;
	condition?: {
		condition_type?: string;
		field?: string;
		logic?: string;
		type?: string;
		value?: string;
		filter_state?: {
			smartFilters?: ISmartFilters;
		};
	}[];
}

export interface IExecutionVariable {
	id: number;
	code: string;
	type: 'global' | 'local';
	title: string;
	value: unknown;
	value_type: string;
	value_multiple: number;
	process_id: number | null;
	editable_by_process: number;
	related_processes?: number[] | null;
	portal?: string;
}

export interface IProcessSnapshot {
	tree?: IProcessSnapshotNode;
	automations_data?: {
		actions?: IProcessSnapshotAction[];
		conditions?: IProcessSnapshotCondition[];
	};
	variables?: IExecutionVariable[];
}

export interface IExecutionDetail {
	execution_id: string;
	automation_id: number;
	portal_id?: number;
	canceled_by?: number;
	title: string;
	status: ExecutionStatuses;
	created_by?: number;
	entity?: IExecutionEntity;
	trigger?: IExecutionTrigger;
	execution_timestamps?: IExecutionTimestamps;
	execution_progress?: IExecutionProgress;
	duration?: number;
	process_snapshot?: IProcessSnapshot;
	nodes: IExecutionNode[];
}

export interface IExecutionActionRoute {
	method?: string;
	route?: string;
	routes?: string[];
}

export interface IExecutionNodeWorker {
	action_id?: number;
	entity_id?: number;
}

export interface IExecutionNodeProcess {
	node_id?: string;
	parent_node_id?: string;
	main_condition_id?: string | null;
	condition_logic?: string | null;
	attempt?: number;
	node_input?: Record<string, unknown> | null;
	node_output?: Record<string, unknown> | null;
	from_parent_id?: string;
}

export interface IExecutionNodeDetail {
	id?: number;
	portal?: string;
	automation_id?: number;
	execution_id?: string;
	type?: string;
	data?: Record<string, unknown> | Record<string, unknown>[];
	status?: string;
	result?: string;
	entity_type?: string;
	context_data?: Record<string, unknown>;
	scheduled_for?: number;
	executed_at?: number;
	created_at?: number;
	action_order?: number;
	action_request?: Record<string, unknown> | string | null;
	action_route?: IExecutionActionRoute | string | null;
	action_response?: Record<string, unknown> | Record<string, unknown>[] | null;
	error_message?: string | null;
	retry_count?: number;
	worker?: IExecutionNodeWorker | null;
	process?: IExecutionNodeProcess | null;
}

export interface IExecutionRequest {
	type: ExecutionHistoryType;
	signal?: AbortSignal;
}

export interface IExecutionHistoryRequest extends IExecutionRequest {
	params?: IExecutionHistoryParams;
}

export interface IExecutionDetailRequest extends IExecutionRequest {
	executionId: string;
}

export interface IExecutionNodeRequest extends IExecutionDetailRequest {
	nodeId: string;
}

export interface IExecutionsCancelRequest {
	type: ExecutionHistoryType;
	id?: number;
	executionIds?: string[];
}

export interface IExecutionActionResult {
	status: string;
	count: number;
}
