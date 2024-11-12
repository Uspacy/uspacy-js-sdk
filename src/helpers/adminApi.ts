import { IAdminUrlParams } from '../services/AnnouncersService/dto/announcers-dto';

export const generateUrlForAdminApi = ({ apiPoint, locale, populateParams }: IAdminUrlParams): string =>
	`${apiPoint}?locale=${locale}${populateParams.reduce((acc, item, index) => (acc += `&populate[${index}]=${item}`), '')}`;
