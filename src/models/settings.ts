export interface IPortalSettings {
	nameFormat: string;
	lang: string;
	timeFormat: string;
	dateFormat: string;
	timezone: string;
	firstDay: string;
	country: string;
	phoneFormat: string;
	availableCurrencies: string[];
	defaultCurrency: string;
	weekends: string[];
	workhoursMode: string;
	workhours: {};
	themeCustomization: boolean;
	themeAccentColor: string;
	themeDecor: string;
	themeName: string;
	holidays: { id: number; date: string; name: string }[];
	logo: string;
	thumbnail: string;
	click2callUrl?: string;
}
