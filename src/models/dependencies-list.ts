export interface IDependenciesList {
	id: number;
	name: string;
	parent_field_code: string;
	child_field_code: string;
	active: boolean;
	inverse_dependence: boolean;
	show_all_options: boolean;
	exclude_selected_options: boolean;
	dependencies: {
		parent_value: string;
		child_value: string;
	}[];
}
