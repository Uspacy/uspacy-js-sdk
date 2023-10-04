import { ITasksParams } from '../../../models/tasks';
import { IUser } from '../../../models/user';

export interface IMassEditingFieldsPayload {
	// ! We get completely different field and setting values
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

export interface IMassActions {
	taskIds: string[];
	exceptIds: number[];
	all: boolean;
	params?: ITasksParams;
	withoutResponsible?: boolean;
	payload?: IMassEditingFieldsPayload;
	settings?: IMassEditingFieldsPayload;
	profile?: IUser;
	admin?: boolean;
}
