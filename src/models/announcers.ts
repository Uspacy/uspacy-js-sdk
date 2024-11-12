import { INotificationMessage } from './notifications';

export type WidgetButtonType = 'main' | 'info';
export type BannerButtonVariant = 'contained' | 'outlined' | 'glass';
export type BannerIcon = 'default';

interface IList {
	id: number;
	text: string;
	link?: string;
}

interface IButton {
	text: string;
	link: string;
	link2?: string;
	apps?: boolean;
	external?: boolean;
}

interface IWidgetButton extends IButton {
	id: number;
	type?: WidgetButtonType;
}

interface IBannerButton extends IButton {
	id: number;
	type?: BannerButtonVariant;
	color?: string;
}

export interface IChip {
	icon?: BannerIcon;
	text?: string;
}

export interface IAnnounceBanner {
	title: string;
	description?: string;
	buttons: IBannerButton[];
	backgroundImage?: IImage;
	backgroundColor?: string;
	chips?: IChip[];
}

export interface IAnnounceNotification extends INotificationMessage {
	id: string;
	title: string;
	subTitle: string;
	buttons?: IButton[];
	image?: IImage;
	isAnnounce?: boolean;
}

export interface IImage {
	data: {
		id: number;
		attributes: {
			url: string;
		};
	} | null;
}

export interface IAnnounceWidget {
	id: number;
	title: string;
	image: IImage;
	text?: string;
	list?: IList[];
	buttons: IWidgetButton[];
}
