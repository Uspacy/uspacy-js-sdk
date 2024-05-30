import { AxiosRequestConfig } from 'axios';
import { injectable } from 'tsyringe';

import { ISessionStorage } from '../../models/session-storage';
import { IStorageService } from '../../models/storage-service';

@injectable()
export class ConfigService {
	private defaultConfig: IConfig = {
		appPrefix: 'USPACY.APP',
		couchDbUrl: 'https://couchdb.uspacy.tech',
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
	sessionStorageService?: ISessionStorage;
	couchDbUrl: string;
}

export interface IConfig extends Partial<IConfigDefault> {}
