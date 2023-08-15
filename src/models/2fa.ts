export interface I2FaEnable {
	step: 'get-qr-code';
	code: number;
}

export interface I2FaStatus {
	enabled: boolean;
}
