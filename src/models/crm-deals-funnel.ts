import { IStage } from './crm-stages';

export interface IFunnel {
	id: number;
	title: string;
	funnel_code: string;
	default: boolean;
	active: boolean;
	stages: IStage[];
}
