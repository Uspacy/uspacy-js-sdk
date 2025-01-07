import { IStage } from './crm-stages';
export type TypePermission = 'allowed' | 'mine';
export interface IFunnel {
	id: number;
	title: string;
	funnel_code: string;
	default: boolean;
	active: boolean;
	stages: IStage[];
	permissions: { create?: TypePermission; view?: TypePermission; edit?: TypePermission; delete?: TypePermission };
}
