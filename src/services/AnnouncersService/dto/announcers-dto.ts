import { IAnnounceBanner, IAnnounceNotification, IAnnouncePopup, IAnnounceWidget } from '../../../models/announcers';

export interface ResponseApiItem {
	id?: number;
	notifications: IAnnounceNotification[];
	widgets: IAnnounceWidget[];
	banner: IAnnounceBanner;
	popup: IAnnouncePopup;
}

export interface ResponseApi {
	data: ResponseApiItem;
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
