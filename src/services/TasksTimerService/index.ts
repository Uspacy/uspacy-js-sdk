import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { ITimerRealTime } from '../../models/timer';
import { ITimerPayload } from './dto/create-update-timer.dto';

/**
 * Tasks timer service
 */
@injectable()
export class TasksTimerService {
	private namespace = '/tasks/v1/timer';

	constructor(private httpClient: HttpClient) {}

	/**
	 * Realtime timer
	 * @returns Object timer entity
	 */
	getTimerRealtime() {
		return this.httpClient.client.get<ITimerRealTime>(`${this.namespace}/realtime`);
	}

	/**
	 * Move task from column to other column
	 * @param id task id
	 * @returns timer id
	 */
	startTimer(id: string) {
		return this.httpClient.client.post(`${this.namespace}/:id/start`, undefined, { urlParams: { id } });
	}

	/**
	 * Move task from column to other column
	 * @param id task id
	 */
	stopTimer(id: string) {
		return this.httpClient.client.post(`${this.namespace}/:id/stop`, undefined, { urlParams: { id } });
	}

	/**
	 * Tasks timer list
	 * @param id task id
	 * @returns Array task timer entity
	 */
	getTimerList(id: string) {
		return this.httpClient.client.get(`${this.namespace}/:id/`, { urlParams: { id } });
	}

	/**
	 * Create new timer
	 * @param id task id
	 * @returns timer object
	 */
	createTimer(id: string, body: ITimerPayload) {
		return this.httpClient.client.post(`${this.namespace}/:id/`, body, { urlParams: { id } });
	}

	/**
	 * Create new timer
	 * @param taskId task id
	 * @param timerId timer id
	 * @returns timer object
	 */
	updateTimer(taskId: string, timerId: string, body: ITimerPayload) {
		return this.httpClient.client.patch(`${this.namespace}/:id/:timerId`, body, { urlParams: { id: taskId, timerId } });
	}

	/**
	 * Create new timer
	 * @param taskId task id
	 * @param timerId timer id
	 * @returns timer object
	 */
	deleteTimer(taskId: string, timerId: string) {
		return this.httpClient.client.delete(`${this.namespace}/:id/:timerId`, { urlParams: { id: taskId, timerId } });
	}
}
