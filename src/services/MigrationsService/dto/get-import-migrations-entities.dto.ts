import { IErrorsAxiosResponse } from '../../../models/errors';
import { IServicesStatus } from '../../../models/migrations';

export interface IMigrationData {
	Name: string;
	Method: string;
}

export interface IDataPresence {
	Domain: string;
	CliendId: string;
	ClientSecret: string;
	Information: unknown;
}

export interface IImportData {
	webhook?: string;
	data: IMigrationData[];
	systemId?: string;
	apiKey?: string;
	systemName?: string;
}

export interface ISystemStatus {
	systemStatus?: IServicesStatus;
	allSystemsStatus?: IServicesStatus;
	loadingProgress: boolean;
	errorLoadingProgress: IErrorsAxiosResponse;
}
