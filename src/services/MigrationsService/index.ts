import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { StorageService } from '../../core/StorageService';
import { IEntity } from '../../models/migrations';
import { IDataPresence, IMigrationData, ISystemStatus } from './dto/get-import-migrations-entities.dto';

/**
 * Migrations service
 */
@injectable()
export class MigrationsService {
	private importNamespace = '/import';
	private calculateNamespace = '/calculate';

	private storageService: StorageService = new StorageService('tokens');
	private getRefreshToken(): Promise<string> {
		return this.storageService.table.getItem('refreshToken');
	}

	/**
	 * @param config http client
	 */
	constructor(private httpClient: HttpClient) {}

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
		const refreshToken = await this.getRefreshToken();

		return this.httpClient.client.post<IEntity>(
			`${this.calculateNamespace}/${systemName}`,
			{ ApiKey: apiKey },
			{
				headers: {
					'X-Refresh': refreshToken || '',
				},
			},
		);
	}

	/**
	 * Import System Entities By API Key
	 * @param apiKey api key
	 * @param data entities fro import
	 * @param systemName name of imported system
	 */
	async importMigrationEntities(apiKey: string, data: IMigrationData[], systemName: string) {
		const refreshToken = await this.getRefreshToken();

		return this.httpClient.client.post(
			`${this.importNamespace}/${systemName}`,
			{ Entities: data, ApiKey: apiKey },
			{
				headers: {
					'X-Refresh': refreshToken || '',
				},
			},
		);
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
		return this.httpClient.client.get<ISystemStatus>(`${this.importNamespace}/progress${system}`, {
			headers: {
				'Content-Type': 'application/json',
			},
			urlParams: { system },
		});
	}

	/**
	 * Stop import progress
	 * @param system system name
	 */
	stopImport(system: string) {
		return this.httpClient.client.get(`${this.importNamespace}/stop?:system`, {
			headers: {
				'Content-Type': 'application/json',
			},
			urlParams: { system },
		});
	}
}
