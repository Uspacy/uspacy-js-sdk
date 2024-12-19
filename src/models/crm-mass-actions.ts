/* eslint-disable @typescript-eslint/no-explicit-any */

import { IUser } from './user';

export interface IMassActions {
	entityIds: number[];
	exceptIds: number[];
	all: boolean;
	params?: string | { [key: string]: any };
	payload?: { [key: string]: any };
	settings?: { [key: string]: any };
	profile?: IUser;
	admin?: boolean;
}
