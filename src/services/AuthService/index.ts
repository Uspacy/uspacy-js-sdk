/* eslint-disable camelcase */
import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { SessionService } from '../../core/SessionService';
import { TokensService } from '../../core/TokensService';
import { I2FaSetup } from '../../models/2fa';
import { IResponseJwt } from '../../models/jwt';
import { IAfterOauthResponse } from '../../models/oauthIntegrations';
import { IPortal } from '../../models/portal';
import { IResponseWithMessage } from '../../models/response';
import { IAuthSession, SESSION_HEADER } from '../../models/session';
import { IBill, ICountry, IDiscountCoupon, IPortalSubscription, IStripeRedirect, ITariff, IVatInfo } from '../../models/tariffs';
import { IUser } from '../../models/user';
import { ICreatePortalDto } from './dto/create-portal.dto';
import { ILoginDto } from './dto/login.dto';
import { IRegisterDto } from './dto/register.dto';
import { IResetPassordDto } from './dto/reset-password.dto';
import { IResponseOauthData } from './dto/response-oauth-data.dto';
import { ISignUpDto } from './dto/sign-up.dto';
import { IIndividualPayload, ILegalPayload, ILegalPayloadEu, ISubscriptionPayload, ISubscriptionStripePayload } from './dto/subscription.dto';
import { IVatValidationPayload } from './dto/vat-validation.dto';

/**
 * Auth service
 */
@injectable()
export class AuthService {
	private namespace = '/auth/v1';
	constructor(
		private readonly tokenService: TokensService,
		private readonly httpClient: HttpClient,
		private readonly sessionService: SessionService,
	) {}

	/**
	 * Login user by email and password
	 * @returns jwt tokens
	 */
	async login({ email, password, code, remember, client, transport }: ILoginDto) {
		try {
			const result = await this.httpClient.client.post<IResponseJwt>(
				`${this.namespace}/auth/sign_in/`,
				{
					email,
					password,
					code,
					...(typeof remember === 'boolean' && { rememberMe: remember }),
					...(client && { client }),
					...(transport && { transport }),
				},
				transport === 'cookie' ? { headers: { [SESSION_HEADER]: 'cookie' }, withCredentials: true } : undefined,
			);
			if (remember) {
				this.sessionService.setRememberSession();
			}
			await this.storeTokens(result.data);
			return result;
		} catch (err) {
			return err;
		}
	}

	/**
	 * Keeps the tokens of a sign-in. Without a refresh token in the body (cookie transport) the cookie holds it,
	 * and a stored one from an earlier session is removed; a handoff answer has no tokens to keep.
	 */
	private async storeTokens(data: Partial<IResponseJwt>) {
		if (!data?.jwt) return;
		if (data.refreshToken) {
			await Promise.all([this.tokenService.setToken(data.jwt), this.tokenService.setRefreshToken(data.refreshToken)]);
			return;
		}
		await this.tokenService.removeRefreshToken();
		await this.tokenService.setToken(data.jwt);
	}

	/**
	 * Sign out: ends the session on the server (best effort: an older server or a network error doesn't stop it),
	 * then removes the local tokens and the "remember me" flag
	 */
	async logout() {
		await this.tokenService.revokeSession();
		await Promise.all([this.tokenService.removeToken(), this.tokenService.removeRefreshToken()]);
		this.sessionService.removeRememberSession();
	}

	/**
	 * Exchange the one-time code from the `#uspacy_handoff=` fragment after a sign-in with `transport: 'handoff'`.
	 * Call it on the portal page: the server sets the session cookie, and the access token is stored
	 * @param code handoff code
	 */
	exchangeHandoffCode(code: string) {
		return this.tokenService.exchangeHandoffCode(code);
	}

	/**
	 * Signed-in sessions of the current user on this portal
	 */
	getSessions() {
		return this.httpClient.client.get<{ data: IAuthSession[] }>(`${this.namespace}/auth/sessions`);
	}

	/**
	 * Sign out one session of the current user
	 * @param id session id
	 */
	revokeSession(id: IAuthSession['id']) {
		return this.httpClient.client.delete<IResponseWithMessage>(`${this.namespace}/auth/sessions/:id`, { urlParams: { id } });
	}

	/**
	 * Sign out every other session of the current user on this portal (app installs keep working)
	 */
	revokeOtherSessions() {
		return this.httpClient.client.post<IResponseWithMessage>(`${this.namespace}/auth/sessions/revoke_others`);
	}

	/**
	 * Send a new email confirmation link. The answer is the same whether or not the address is registered
	 * @param email user email
	 */
	resendConfirmation(email: string) {
		return this.httpClient.client.post<IResponseWithMessage>(`${this.namespace}/auth/resend_confirmation`, { email }, { useAuth: false });
	}

	/**
	 * Mandatory 2FA setup at sign-in: a new secret and its QR code
	 * @param setupToken `setupToken` from the sign-in answer with `twofaSetupRequired`
	 */
	startTwofaSetup(setupToken: string) {
		return this.httpClient.client.post<I2FaSetup>(`${this.namespace}/auth/2fa/setup`, { setupToken }, { useAuth: false });
	}

	/**
	 * Mandatory 2FA setup at sign-in: a code from the authenticator app turns 2FA on and signs in
	 * (the tokens are stored as by `login`)
	 * @param setupToken `setupToken` from the sign-in answer with `twofaSetupRequired`
	 * @param code code from the authenticator app
	 */
	async confirmTwofaSetup(
		setupToken: string,
		code: string,
		{ remember, client, transport }: Pick<ILoginDto, 'remember' | 'client' | 'transport'> = {},
	) {
		const result = await this.httpClient.client.post<IResponseJwt>(
			`${this.namespace}/auth/2fa/setup/confirm`,
			{
				setupToken,
				code,
				...(typeof remember === 'boolean' && { rememberMe: remember }),
				...(client && { client }),
				...(transport && { transport }),
			},
			{ useAuth: false, ...(transport === 'cookie' && { headers: { [SESSION_HEADER]: 'cookie' }, withCredentials: true }) },
		);
		if (remember) {
			this.sessionService.setRememberSession();
		}
		await this.storeTokens(result.data);
		return result;
	}

	/**
	 * Confirm user email
	 * @param body email and token
	 * @returns new jwt tokens
	 */
	confirmEmail(body: { email: string; token: string }) {
		return this.httpClient.client.post<IResponseJwt>(`${this.namespace}/auth/confirm_email/`, body);
	}

	/**
	 * Refresh token
	 * @param refreshToken refresh token from login method
	 * @returns new jwt tokens
	 */
	refreshToken(refreshToken: string) {
		return this.httpClient.client.post<IResponseJwt>(`${this.namespace}/auth/refresh_token/`, null, {
			headers: {
				Authorization: `Bearer ${refreshToken}`,
			},
		});
	}

	/**
	 * Create user by invitation
	 * @returns jwt tokens
	 */
	register(body: IRegisterDto) {
		return this.httpClient.client.post<IResponseJwt>(`${this.namespace}/auth/register/`, body);
	}

	/**
	 * Create user by invitation
	 * @returns jwt tokens
	 */
	signUp(body: ISignUpDto) {
		return this.httpClient.client.post<IResponseJwt>(`${this.namespace}/users/`, body);
	}

	/**
	 * Send email with password link recover
	 * @param email user email
	 */
	forgotPassword(email: string) {
		return this.httpClient.client.post(`${this.namespace}/users/forgot_password/`, { email });
	}

	/**
	 * Rest password
	 */
	resetPassword(body: IResetPassordDto) {
		return this.httpClient.client.post(`${this.namespace}/users/reset_password/`, body);
	}

	/**
	 * Change password by user id
	 * @deprecated the server no longer has this endpoint; use `changeMyPassword`
	 * @param password user password
	 */
	changePassword(userId: number, password: string) {
		return this.httpClient.client.post<IUser>(`${this.namespace}/users/:userId/change_password/`, { password }, { urlParams: { userId } });
	}

	/**
	 * Change self password
	 * @param oldPassword old user password
	 * @param newPassword new user password
	 * @param logoutOtherSessions sign out the user's other sessions; the server does it when this is not sent
	 */
	changeMyPassword(oldPassword: string, newPassword: string, logoutOtherSessions?: boolean) {
		return this.httpClient.client.patch(`${this.namespace}/users/change_password`, {
			oldPassword,
			newPassword,
			...(typeof logoutOtherSessions === 'boolean' && { logoutOtherSessions }),
		});
	}

	/**
	 * Email existence check
	 * @param email email
	 */
	checkEmail(email: string) {
		return this.httpClient.client.get(`${this.namespace}/users/check_email/`, { params: { email } });
	}

	/**
	 * Portal domain availability check
	 * @param domain portal name
	 */
	checkPortalByDomain(domain: string) {
		return this.httpClient.client.get<IResponseWithMessage>(`${this.namespace}/portals/`, { params: { domain } });
	}

	/**
	 * Create portal
	 */
	createPortal(body: ICreatePortalDto) {
		return this.httpClient.client.post<IPortal>(`${this.namespace}/portals/`, body);
	}

	/**
	 * Redirect to uspacy after google oauth
	 */
	getUrlToRedirectAfterOAuth(body: IResponseOauthData) {
		return this.httpClient.client.get<IAfterOauthResponse>(`${this.namespace}/oauth/info`, { params: body, useAuth: false });
	}

	/**
	 * Get tariffs list
	 * @returns Array tarifs entity
	 */
	getTariffsList() {
		return this.httpClient.client.get<ITariff[]>(`${this.namespace}/tariffs`);
	}

	getPortalSubscription() {
		return this.httpClient.client.get<IPortalSubscription>(`${this.namespace}/tariffs/subscription`);
	}

	/**
	 * Create subscription individual
	 * @returns Object invoice entity
	 */
	createSubscriptionInvdividual(body: Partial<IIndividualPayload>) {
		return this.httpClient.client.post<IBill>(`${this.namespace}/tariffs/invoices/individual`, body);
	}

	/**
	 * Create subscription legal
	 * @returns Object invoice entity
	 */
	createSubscriptionLegal(body: Partial<ILegalPayload>) {
		return this.httpClient.client.post<IBill>(`${this.namespace}/tariffs/invoices/legal`, body);
	}

	/**
	 * Redirect to stripe buy
	 * @returns url to stripe redirecting
	 */
	redirectToStripe(body: Partial<ISubscriptionStripePayload>) {
		return this.httpClient.client.post<IStripeRedirect>(`${this.namespace}/tariffs/stripe/buy`, body);
	}

	/**
	 * Create subscription legal EU
	 * @returns Object invoice entity
	 */
	createSubscriptionLegalEu(body: Partial<ILegalPayloadEu>) {
		return this.httpClient.client.post<IBill>(`${this.namespace}/tariffs/invoices/legal_eu`, body);
	}

	/**
	 * Activating demo tariff
	 */
	activatingDemo() {
		return this.httpClient.client.post(`${this.namespace}/tariffs/demo`);
	}

	/**
	 * Disable subscription renewal
	 */
	disableSubscriptionRenewal() {
		return this.httpClient.client.post<boolean>(`${this.namespace}/tariffs/disable_renewal`);
	}

	/**
	 * Downgrade tariff
	 */
	downgradeTariff(body: Pick<ISubscriptionPayload, 'plan_code' | 'quantity'>) {
		return this.httpClient.client.post<IPortalSubscription>(`${this.namespace}/tariffs/downgrade`, body);
	}

	/**
	 * Get discount coupon
	 * @param couponCode
	 * @returns Object coupon entity
	 */
	getDiscountCoupon(couponCode: string) {
		return this.httpClient.client.get<IDiscountCoupon>(`${this.namespace}/tariffs/coupons/${couponCode}`);
	}

	/**
	 * Check VAT validity
	 * @param country
	 * @param vatNumber
	 * @returns Object with isValid field
	 */
	vatValidation({ country, vatNumber }: IVatValidationPayload) {
		return this.httpClient.client.get<IVatInfo>(`${this.namespace}/tariffs/legal/check_vat`, {
			params: { country, vatNumber },
		});
	}

	/**
	 * Get countries list
	 * @returns Array of countries
	 */
	getCountriesList() {
		return this.httpClient.client.get<ICountry[]>(`${this.namespace}/tariffs/country`);
	}
}
