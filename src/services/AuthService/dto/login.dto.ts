/**
 * @param email user email
 * @param password user password
 * @param code 2FA code
 * @param remember remember session; sent to the server as `rememberMe` when set
 * @param client `mobile` for a mobile app session; sent when set
 * @param transport `cookie` puts the refresh token into the portal's HttpOnly cookie (sign-in on the portal host),
 * `handoff` returns a one-time code for the portal instead of tokens; not set: tokens in the body, as before
 */
export interface ILoginDto {
	email: string;
	password: string;
	code?: string;
	remember?: boolean;
	client?: 'mobile' | 'web';
	transport?: 'cookie' | 'handoff';
}
