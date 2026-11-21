export type TwofaPolicyMode = 'off' | 'log' | 'enforce';

export interface ISecuritySettingsUser {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	roles: string[];
}

/**
 * Workspace security settings
 */
export interface ISecuritySettings {
	/**
	 * 2FA is required from every employee
	 */
	twofaRequired: boolean;
	/**
	 * days to set up 2FA after it becomes required
	 */
	graceDays: number;
	/**
	 * Unix time
	 */
	requiredSince: number | null;
	updatedBy: number | null;
	/**
	 * Owners and Admins always need 2FA
	 */
	adminsRequired: boolean;
	/**
	 * Unix time by which Owners and Admins must set up 2FA
	 */
	adminDeadline: number | null;
	policyMode: TwofaPolicyMode;
	/**
	 * active Owners and Admins without 2FA
	 */
	adminsWithoutTwofa: ISecuritySettingsUser[];
}

/**
 * @param twofaRequired require 2FA from every employee (only the Owner, who needs 2FA on)
 * @param graceDays days to set up 2FA, 0 to 30
 * @param code the Owner's current 2FA code, needed to turn twofaRequired off
 */
export interface IUpdateSecuritySettings {
	twofaRequired?: boolean;
	graceDays?: number;
	code?: string;
}
