import { IUser } from '../../../models/user';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IMassActions {
	taskIds: string[];
	exceptIds: number[];
	all: boolean;
	params?: any;
	withoutResponsible?: boolean;
	profile?: IUser;
}
