import { injectable } from 'tsyringe';

import { ICouchQueryResponse } from '../../models/couchdb';
import { IColumnSettings } from '../../models/table-settings';
import { CouchdbService } from '../CouchdbService';

/**
 * TableSettingsService
 */
@injectable()
export class TableSettingsService {
	constructor(private readonly couchdbService: CouchdbService) {}
	/**
	 * Create table settings
	 * @param databaseName Database name
	 * @param body payload settings
	 * @param type table settings type
	 */
	createTableSettings(databaseName: string, body: IColumnSettings, type: string) {
		return this.couchdbService.create(databaseName, body, type);
	}

	/**
	 * Get table settings
	 * @returns table settings
	 * @param databaseName Database name
	 * @param type table settings type
	 */
	getTableSettings(databaseName: string, type: string) {
		return this.couchdbService.find<ICouchQueryResponse<IColumnSettings>>(databaseName, type);
	}

	/**
	 * Update table settings
	 * @returns table settings
	 * @param databaseName Database name
	 * @param id Document id
	 * @param rev Document revision
	 * @param body payload settings
	 */
	updateTableSettings(databaseName: string, id: string, rev: string, body: IColumnSettings) {
		return this.couchdbService.update(databaseName, id, rev, body);
	}
}
