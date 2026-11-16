export interface IMentionCreateDto {
	name: string;
	users?: number[];
	groups?: number[];
	departments?: number[];
}

export type IMentionUpdateDto = Partial<IMentionCreateDto>;
