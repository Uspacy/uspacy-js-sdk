import { AxiosRequestConfig } from 'axios';
import { injectable } from 'tsyringe';

import { IStorageService } from '../../models/storage-service';

@injectable()
export class ConfigService {
	private defaultConfig: IConfig = {
		appPrefix: 'USPACY.APP',
	};
	constructor(private readonly _config?: IConfig) {}

	get config() {
		return {
			...this._config,
			...this.defaultConfig,
		};
	}
}

interface IConfigDefault {
	httpClientConfig: AxiosRequestConfig;
	appPrefix: string;
	storageService?: IStorageService;
}

export interface IConfig extends Partial<IConfigDefault> {}
