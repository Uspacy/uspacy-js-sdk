export interface I2FaEnable {
	step: 'get-qr-code';
	code: number;
}

export interface I2FaStatus {
	enabled: boolean;
}

/**
 * A new 2FA secret: the key and its QR code
 */
export interface I2FaSetup {
	secretKey: string;
	qrCodeUri: string;
}

/**
 * The 403 of a sign-in when 2FA is mandatory for the user and not set up yet:
 * the setup step continues with `setupToken` (valid 10 minutes)
 */
export interface I2FaSetupRequired {
	twofaSetupRequired: true;
	setupToken: string;
	code: 'twofa_enrollment_required';
	errors?: { text: string[] };
	rememberMe?: boolean;
	returnUrl?: string;
}
