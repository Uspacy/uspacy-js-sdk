/* eslint-disable camelcase */
import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { SessionService } from '../../core/SessionService';
import { TokensService } from '../../core/TokensService';
import { IAfterGoogleOauthResponse } from '../../models/calendars';
import { IResponseJwt } from '../../models/jwt';
import { IPortal } from '../../models/portal';
import { IResponseWithMessage } from '../../models/response';
import { ICoupon, IIntent, IInvoice, IInvoiceData, IInvoices, IPortalSubscription, IRatesList, ISubscription, ITariff } from '../../models/tariffs';
import { IUser } from '../../models/user';
import { ICreatePortalDto } from './dto/create-portal.dto';
import { IDowngradePayload } from './dto/downgrade.dto';
import { ILoginDto } from './dto/login.dto';
import { IRegisterDto } from './dto/register.dto';
import { IResetPassordDto } from './dto/reset-password.dto';
import { IResponseGoogleData } from './dto/response-google-data.dto';
import { ISignUpDto } from './dto/sign-up.dto';
import {
	ICreateUsingPaymentIntent,
	IIndividualPayload,
	IIntentPayload,
	ILegalPayload,
	ISubscriptionsIndividual,
	ISubscriptionsLegal,
} from './dto/subscription.dto';

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
	 * Get invoices list
	 * @param limit invoices limit
	 * @returns Array with invoices entities
	 */
	getInvoices(limit: number) {
		return this.httpClient.client.get<IInvoices>(`${this.namespace}/invoices/`, { params: { limit } });
	}

	/**
	 * Get invoice pdf link
	 * @param id invoice id
	 * @returns Download link
	 */
	getInvoicesPdf(id: string) {
		return this.httpClient.client.get<{ download_url: string }>(`${this.namespace}/invoices/:id/pdf/`, { urlParams: { id } });
	}

	/**
	 * Get rates list
	 * @returns Array rates entity
	 */
	getRatesList() {
		return this.httpClient.client.get<IRatesList>(`${this.namespace}/rates/`);
	}

	/**
	 * Get current subscription
	 * @returns Object subscription entity
	 */
	getSubscription() {
		return this.httpClient.client.get<ISubscription>(`${this.namespace}/subscriptions/`);
	}

	/**
	 * Get coupon
	 * @returns Object coupon entity
	 */
	getCoupon(couponCode: string) {
		return this.httpClient.client.get<ICoupon>(`${this.namespace}/coupons/${couponCode}`);
	}

	/**
	 * Set subscription individual
	 * @returns Object invoice entity
	 */
	subscriptionInvdividual(body: ISubscriptionsIndividual) {
		return this.httpClient.client.post<IInvoiceData>(`${this.namespace}/subscriptions/individual`, body);
	}

	/**
	 * Set subscription legal
	 * @returns Object invoice entity
	 */
	subscriptionLegal(body: ISubscriptionsLegal) {
		return this.httpClient.client.post<IInvoiceData>(`${this.namespace}/subscriptions/legal`, body);
	}

	/**
	 * Activate demo tariff
	 */
	activateDemo() {
		return this.httpClient.client.post(`${this.namespace}/subscriptions/demo`);
	}

	/**
	 * Create payment intent for card payment in EU, COM, BR, PL
	 */
	createPaymentIntent(body: IIntentPayload) {
		return this.httpClient.client.post<IIntent>(`${this.namespace}/chargebee/payment_intent`, body);
	}

	/**
	 * Create using payment intent for card payment in EU, COM, BR, PL
	 */
	createUsingPaymentIntent(body: ICreateUsingPaymentIntent) {
		return this.httpClient.client.post(`${this.namespace}/chargebee/create_using_payment_intent`, body);
	}

	/**
	 * Disable subscriptions renewal
	 */
	disableSubscriptionsRenewal(auto_debit: boolean) {
		return this.httpClient.client.post<boolean>(`${this.namespace}/subscriptions/disable_renewal`, auto_debit);
	}

	/**
	 * Downgrade tariff
	 */
	downgrade(body: IDowngradePayload) {
		return this.httpClient.client.post<boolean>(`${this.namespace}/subscriptions/downgrade`, body);
	}

	/**
	 * Redirect to uspacy after google oauth
	 */
	getUrlToRedirectAfterOAuth(body: IResponseGoogleData) {
		return this.httpClient.client.get<IAfterGoogleOauthResponse>(`${this.namespace}/calendars/google/info`, { params: body, useAuth: false });
	}

	// ! NEW BILLING
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
	createSubscriptionInvdividual(body: IIndividualPayload) {
		return this.httpClient.client.post<IInvoice>(`${this.namespace}/tariffs/invoices/individual`, body);
	}

	/**
	 * Create subscription legal
	 * @returns Object invoice entity
	 */
	createSubscriptionLegal(body: ILegalPayload) {
		return this.httpClient.client.post<IInvoice>(`${this.namespace}/tariffs/invoices/legal`, body);
	}

	/**
	 * Activating demo tariff
	 */
	activatingDemo() {
		return this.httpClient.client.post<{ status: 'ok' }>(`${this.namespace}/tariffs/demo`);
	}

	/**
	 * Disable subscription renewal
	 */
	disableSubscriptionRenewal() {
		return this.httpClient.client.post<boolean>(`${this.namespace}/tariffs/disable_renewal`);
	}
}
