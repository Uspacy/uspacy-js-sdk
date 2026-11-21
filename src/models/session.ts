/**
 * Where the refresh token lives.
 * - `bearer`: in the token storage, sent in the `Authorization` header (sessions signed in before the cookie transport);
 * - `cookie`: in an HttpOnly cookie of the portal host that scripts can't read; the token storage has no refresh token.
 */
export type SessionTransport = 'bearer' | 'cookie';

/**
 * Request header that lets a same-origin request spend the session cookie
 */
export const SESSION_HEADER = 'X-Uspacy-Session';

/**
 * Event dispatched on `window` when the server refuses to refresh a session until the user acts
 * (`detail` is {@link ISessionBlockedDetail}). The session stays signed in locally.
 */
export const SESSION_BLOCKED_EVENT = 'uspacy:session-blocked';

/**
 * Error codes of the auth endpoints. The 403 of a refresh with `email_verification_required` or
 * `twofa_enrollment_required` means the user has to confirm the email or set up 2FA (sign in again for the setup step).
 */
export enum AuthErrorCode {
	EMAIL_VERIFICATION_REQUIRED = 'email_verification_required',
	TWOFA_ENROLLMENT_REQUIRED = 'twofa_enrollment_required',
	TWOFA_CODE_REQUIRED = 'twofa_code_required',
	TWOFA_CODE_INVALID = 'twofa_code_invalid',
	TWOFA_ATTEMPTS_EXCEEDED = 'twofa_attempts_exceeded',
	TWOFA_ALREADY_ENABLED = 'twofa_already_enabled',
}

/**
 * Codes that block a session's refresh until the user acts
 */
export const SESSION_BLOCKING_CODES: string[] = [AuthErrorCode.EMAIL_VERIFICATION_REQUIRED, AuthErrorCode.TWOFA_ENROLLMENT_REQUIRED];

export interface ISessionBlockedDetail {
	code: AuthErrorCode | string;
	status: number;
	data: unknown;
}

export type SessionKind = 'web' | 'mobile' | 'api' | 'app_install' | 'oauth';

/**
 * A signed-in session of the current user on the portal
 */
export interface IAuthSession {
	id: string;
	kind: SessionKind | string;
	/**
	 * the session of the token that asked
	 */
	current: boolean;
	remember: boolean;
	createdAt: string;
	lastUsedAt: string;
	expiresAt: string;
	userAgent: string | null;
	ip: string | null;
}

/**
 * Tokens of the cookie transport: the refresh token is in the cookie, not in the body
 */
export interface IAccessTokenResponse {
	jwt: string;
	expireInSeconds: number;
}

/**
 * Sign-in with `transport: 'handoff'`: the portal exchanges the code for its cookie and the access token
 */
export interface IHandoffResponse {
	handoffCode: string;
	domain: string;
}
