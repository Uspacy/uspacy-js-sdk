/* eslint-disable camelcase */
import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { SessionService } from '../../core/SessionService';
import { TokensService } from '../../core/TokensService';
import { IResponseJwt } from '../../models/jwt';
import { IAfterOauthResponse } from '../../models/oauthIntegrations';
import { IPortal } from '../../models/portal';
import { IResponseWithMessage } from '../../models/response';
import { IBill, IDiscountCoupon, IPortalSubscription, IStripeRedirect, ITariff } from '../../models/tariffs';
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
	async login({ email, password, code, remember }: ILoginDto) {
		try {
			const result = await this.httpClient.client.post<IResponseJwt>(`${this.namespace}/auth/sign_in/`, {
				email,
				password,
				code,
			});
			if (remember) {
				this.sessionService.setRememberSession();
			}
			const setTokenPromise = this.tokenService.setToken(result.data.jwt);
			const setRefreshTokenPromise = this.tokenService.setRefreshToken(result.data.refreshToken);
			await Promise.all([setTokenPromise, setRefreshTokenPromise]);
			return result;
		} catch (err) {
			return err;
		}
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
	 * @param password user password
	 */
	changePassword(userId: number, password: string) {
		return this.httpClient.client.post<IUser>(`${this.namespace}/users/:userId/change_password/`, { password }, { urlParams: { userId } });
	}

	/**
	 * Change self password
	 * @param oldPassword old user password
	 * @param newPassword new user password
	 */
	changeMyPassword(oldPassword: string, newPassword: string) {
		return this.httpClient.client.post(`${this.namespace}/users/me/reset_password/`, { oldPassword, newPassword });
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
	 * Create subscription legal EU
	 * @returns Object invoice entity
	 */
	createSubscriptionLegalEu(body: Partial<ILegalPayloadEu>) {
		return this.httpClient.client.post<IBill>(`${this.namespace}/tariffs/invoices/legal_eu`, body);
	}

	/**
	 * Redirect to stripe buy
	 * @returns url to stripe redirecting
	 */
	redirectToStripe(body: Partial<ISubscriptionStripePayload>) {
		return this.httpClient.client.post<IStripeRedirect>(`${this.namespace}/tariffs/stripe/buy`, body);
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
	 * @param region
	 * @returns Object with isValid field
	 */
	vatValidation({ country, vatNumber, region }: IVatValidationPayload) {
		return this.httpClient.client.get<{ isValid: boolean }>(`${this.namespace}/tariffs/legal/check_vat`, {
			params: { country, vatNumber, ...(region && { region }) },
		});
	}

	/**
	 * Get countries list
	 * @returns Array of countries
	 */
	getCountriesList() {
		return this.httpClient.client.get<{ title: string; code: string }>(`${this.namespace}/tariffs/country`);
	}
}
