export interface IErrorsAxiosResponse {
	response: {
		status?: number;
		data?: {
			errors?: {
				text?: string[];
			};
		};
	};
}
