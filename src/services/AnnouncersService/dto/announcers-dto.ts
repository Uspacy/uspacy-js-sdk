import { IAnnounceBanner, IAnnounceNotification, IAnnounceWidget } from '../../../models/announcers';

export interface ResponseApiItem<T> {
	id: number;
	attributes: T;
}

export interface ResponseApi<D> {
	data: D;
	meta: {
		pagination: {
			page: number;
			pageSize: number;
			pageCount: number;
			total: number;
		};
	};
}

export interface IAdminUrlParams {
	apiPoint: string;
	locale?: string;
	populateParams: string[];
}

export interface IAnnouncers {
	data: ResponseApi<
		ResponseApiItem<{
			notification: IAnnounceNotification;
			widget: IAnnounceWidget[];
			banner: IAnnounceBanner;
		}>
	>;
}
