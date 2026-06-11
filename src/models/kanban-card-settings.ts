export interface IKanbanCardSettingsData {
	activeSettings: string[];
	stagesSettings?: Record<string, { activeSettings: string[] }>;
}

export interface IKanbanCardSettings {
	id: string;
	data: Record<string, IKanbanCardSettingsData>;
}
