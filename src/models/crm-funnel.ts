import { IStage } from './crm-stages';
export type TypePermission = 'allowed' | 'mine' | 'department';
export interface IFunnel {
	id: number;
	title: string;
	funnel_code: string;
	default: boolean;
	active: boolean;
	stages: IStage[];
	tariff_limited: boolean;
	permissions?: { create?: TypePermission; view?: TypePermission; edit?: TypePermission; delete?: TypePermission };
}
