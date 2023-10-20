import { AxiosError } from 'axios';

export interface IErrorDataInterface {
	errors: {
		text: string[];
	};
	status: boolean;
}

export interface IErrorsAxiosResponse extends AxiosError<IErrorDataInterface> {}
