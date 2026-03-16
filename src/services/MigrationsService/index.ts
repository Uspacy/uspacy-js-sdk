import { injectable } from 'tsyringe';

import { ConfigService } from '../../core/ConfigService';
import { HttpClient } from '../../core/HttpClient';
import { StorageService } from '../../core/StorageService';
import { IEntity } from '../../models/migrations';
import { IDataPresence, IMigrationBody, IMigrationData, ISystemStatus } from './dto/get-import-migrations-entities.dto';

/**
 * Migrations service
 */
@injectable()
export class MigrationsService {
	private importNamespace = '/import';
	private calculateNamespace = '/calculate';

	private storageService: StorageService;
	private getRefreshToken(): Promise<string> {
		return this.storageService.getItem('refreshToken');
	}

	/**
	 * @param config http client
	 */
	constructor(
		private httpClient: HttpClient,
		private configService: ConfigService,
	) {
		this.storageService = new StorageService('tokens', configService);
	}

	/**
	 * Get Bitrix24 Entities
	 * @param webhook webhook token
	 * @returns entities list
	 */
	async getBitrix24Entities(webhook: string) {
		const refreshToken = await this.getRefreshToken();

		return this.httpClient.client.post(
			`${this.calculateNamespace}/bitrix24`,
			{ BitrixWebhook: webhook },
			{
				headers: {
					'X-Refresh': refreshToken || '',
				},
			},
		);
	}

	/**
	 * Import Bitrix24 Entities
	 * @param webhook webhook token
	 * @param data entities fro import
	 */
	async importBitrix24Entities(webhook: string, data: IMigrationData[]) {
		const refreshToken = await this.getRefreshToken();

		return this.httpClient.client.post(
			`${this.importNamespace}/bitrix24`,
			{ BitrixWebhook: webhook, BitrixEntities: data },
			{
				headers: {
					'X-Refresh': refreshToken || '',
				},
			},
		);
	}

	/**
	 * Get Amo (Kommo) Entities
	 * @param id system id (1: Amo, 2: Kommo)
	 * @returns entities list
	 */
	async getAmoEntites(id: string) {
		const refreshToken = await this.getRefreshToken();

		return this.httpClient.client.post(`${this.calculateNamespace}/amo?system=${id}`, {
			headers: {
				'X-Refresh': refreshToken || '',
			},
		});
	}

	/**
	 * Import Amo (Kommo) Entities
	 * @param id system id (1: Amo, 2: Kommo)
	 * @param data entities for import
	 */
	async importAmoEntities(id: string, data: IMigrationData[]) {
		const refreshToken = await this.getRefreshToken();

		return this.httpClient.client.post(
			`${this.importNamespace}/amo?system=${id}`,
			{ AmoEntities: data },
			{
				headers: {
					'X-Refresh': refreshToken || '',
				},
			},
		);
	}

	/**
	 * Get System Entities By API Key
	 * @param apiKey api key
	 * @param systemName name of imported system
	 * @returns entities list
	 */
	async getMigrationEntities(apiKey: string, systemName: string) {
		switch (systemName) {
			case 'pipedrive': {
				return this.httpClient.client.post<IEntity>(`${this.importNamespace}/v1/${systemName}/calculate`, { ApiKey: apiKey });
			}
			default:
				return this.httpClient.client.post<IEntity>(`${this.calculateNamespace}/${systemName}`, { ApiKey: apiKey });
		}
	}

	/**
	 * Import System Entities By API Key
	 * @param apiKey api key
	 * @param data entities for import
	 * @param systemName name of imported system
	 * @param body response body
	 */
	async importMigrationEntities(apiKey: string, data: IMigrationData[], systemName: string, body?: IMigrationBody) {
		const responseBody = systemName === 'monday' ? body : { Entities: data, ApiKey: apiKey };
		switch (systemName) {
			case 'pipedrive': {
				return this.httpClient.client.post(`${this.importNamespace}/v1/${systemName}/import`, responseBody);
			}
			default:
				return this.httpClient.client.post(`${this.importNamespace}/${systemName}`, responseBody);
		}
	}

	/**
	 * Get presence data for Zoho
	 */
	getDataPresence() {
		return this.httpClient.client.post<IDataPresence>('/dataPresence/zoho');
	}

	/**
	 * Get status for all systems
	 */
	getAllSystemsStatus() {
		return this.httpClient.client.get<ISystemStatus>(`${this.importNamespace}/progress`, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	/**
	 * Get impotr progress
	 * @param system system name
	 */
	getSystemProgress(system: string) {
		return this.httpClient.client.get<ISystemStatus>(`${this.importNamespace}/progress`, {
			headers: {
				'Content-Type': 'application/json',
			},
			params: { system },
		});
	}

	/**
	 * Get monday import progress
	 * @param system system name
	 */
	getMondayProgress(system: string) {
		return this.httpClient.client.get<ISystemStatus>(`/progress/${system}`, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	/**
	 * Stop import progress
	 * @param system system name
	 */
	stopImport(system: string) {
		switch (system) {
			case 'trello':
				return this.httpClient.client.post(`${this.importNamespace}/v1/trello/stop`);
			default:
				return this.httpClient.client.get(`${this.importNamespace}/stop`, {
					headers: {
						'Content-Type': 'application/json',
					},
					params: { system },
				});
		}
	}
}
