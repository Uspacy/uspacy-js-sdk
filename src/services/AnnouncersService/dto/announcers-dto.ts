import { IAnnounceBanner, IAnnounceNotification, IAnnounceWidget } from '../../../models/announcers';

export interface ResponseApiItem<T> {
	id?: number;
	attributes: T;
}

export interface ResponseApi {
	data: ResponseApiItem<{
		notification: IAnnounceNotification;
		widget: IAnnounceWidget[];
		banner: IAnnounceBanner;
	}>;
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
	apiPoint?: string;
	locale?: string;
	populateParams: string[];
}
