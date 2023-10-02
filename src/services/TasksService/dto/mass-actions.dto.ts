import { ITasksParams } from '../../../models/tasks';
import { IUser } from '../../../models/user';

export interface IMassActions {
	taskIds: string[];
	exceptIds: number[];
	all: boolean;
	params?: ITasksParams;
	withoutResponsible?: boolean;
	profile?: IUser;
}
