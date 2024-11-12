import { IAdminUrlParams } from '../models/admin-api';

export const generateUrlForAdminApi = ({ apiPoint, locale, populateParams }: IAdminUrlParams): string =>
	`${apiPoint}?locale=${locale}${populateParams.reduce((acc, item, index) => (acc += `&populate[${index}]=${item}`), '')}`;
