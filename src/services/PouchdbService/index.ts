import PouchDB from 'pouchdb';
import PouchDBIndexeddb from 'pouchdb-adapter-indexeddb';
import PouchDBFind from 'pouchdb-find';
import { injectable } from 'tsyringe';
import { v4 as uuid } from 'uuid';

import { TokensService } from '../../core/TokensService';

PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchDBIndexeddb);

/**
 * PouchDb service
 */
@injectable()
export class PouchdbService {
	private namespace = '/settings-backend/v1';
	constructor(private readonly tokenService: TokensService) {}

	async getPartitionKey(type: string) {
		const docodedToken = await this.tokenService.decodeToken();
		return `${docodedToken.domain}-${docodedToken.id}-${type}`;
	}

	async db(dbName: string) {
		return new PouchDB(dbName, { adapter: 'idb' });
	}

	async remoteDb(dbName: string) {
		const docodedToken = await this.tokenService.decodeToken();
		const token = await this.tokenService.getToken();
		const url = `https://${docodedToken.domain}${this.namespace}/${dbName}`;

		return new PouchDB(url, {
			fetch: async (dbUrl, opts) => {
				opts.headers = { Authorization: `Bearer ${token}` };
				return PouchDB.fetch(dbUrl, opts);
			},
		});
	}

	async find(dbName: string, type: string) {
		const db = await this.db(dbName);
		const partitionKey = await this.getPartitionKey(type);

		const params = {
			selector: { _id: { $gt: partitionKey, $lt: `${partitionKey}\\ufff0` } },
			limit: 1000,
			skip: 0,
		};

		return db.find(params);
	}

	async post(dbName: string, type: string, payload: object) {
		const db = await this.db(dbName);
		const partitionKey = await this.getPartitionKey(type);
		const _id = partitionKey + `:${uuid()}`;

		return await db.post({ _id, type, ...payload });
	}

	async put(dbName: string, type: string, _id: string, _rev: string, payload: object) {
		const db = await this.db(dbName);

		return await db.put({ _id, _rev, type, ...payload });
	}
}
