import { AxiosError } from 'axios';

export interface IErrorDataInterface {
	errors: {
		[key: string]: string[];
	};
	status: boolean;
}

export interface IErrorsAxiosResponse extends AxiosError<IErrorDataInterface> {}
