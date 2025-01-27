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

export interface IWidgetButton extends IButton {
	id: number;
	type?: WidgetButtonType;
}

export interface IBannerButton extends IButton {
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
	startDate?: string;
	endDate?: string;
}

export interface IAnnounceNotification extends INotificationMessage {
	id: string;
	title: string;
	subTitle: string;
	date: number;
	buttons?: IButton[];
	image?: IImage;
	isAnnounce?: boolean;
	startDate?: string;
	endDate?: string;
}

export interface IImage {
	id: number;
	url: string;
}

export interface IAnnounceWidget {
	id: number;
	title: string;
	image: IImage;
	text?: string;
	list?: IList[];
	buttons: IWidgetButton[];
	startDate?: string;
	endDate?: string;
}

export interface IPopupButton extends Omit<IButton, 'link2' | 'apps'> {
	additionalLink?: string;
}

export interface IAnnouncePopup {
	id: number;
	button: IPopupButton;
	infoLink: IWidgetButton;
	mobileTitle: string;
	paragraphOne: string;
	paragraphTwo: string;
	paragraphThree: string;
	slides: IImage[];
	subtitle: string;
	title: string;
	list: IList[];
	startDate?: string;
	endDate?: string;
}
