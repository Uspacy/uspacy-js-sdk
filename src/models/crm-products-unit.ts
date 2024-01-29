export interface IMeasurementUnit {
	id: number;
	name: string;
	abbr: string;
	is_default: number;
}

export interface IMeasurementUnits {
	data: IMeasurementUnit[];
}
