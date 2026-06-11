export interface ISettingsItem {
	activeSettings: string[];
	activeBottomSettings: string[];
}

export interface IKanbanCardSettingsData extends ISettingsItem {
	stagesSettings?: Record<string, ISettingsItem>;
}

export interface IKanbanCardSettings {
	id: string;
	data: Record<string, IKanbanCardSettingsData>;
}
