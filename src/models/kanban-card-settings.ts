export interface IKanbanCardSettingsData {
	active: string[];
	order: string[];
	stagesSettings?: Record<string, { active: string[]; order: string[] }>;
}

export interface IKanbanCardSettings {
	id: string;
	data: Record<string, IKanbanCardSettingsData>;
}
