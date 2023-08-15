import { injectable } from 'tsyringe';

import { HttpClient } from '../../core/HttpClient';
import { SessionService } from '../../core/SessionService';
import { TokensService } from '../../core/TokensService';
import { ReponseJwt } from '../../models/jwt';
import { IPortal } from '../../models/portal';
import { IUser } from '../../models/user';
import { ICreatePortalDto } from './dto/create-portal.dto';
import { ILoginDto } from './dto/login.dto';
import { IRegisterDto } from './dto/register.dto';
import { IResetPassordDto } from './dto/reset-password.dto';
import { ISignUpDto } from './dto/sign-up.dto';
import { IResponseWithMessage } from '../../models/response';

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
			const result = await this.httpClient.client.post<ReponseJwt>(`${this.namespace}/auth/sign_in/`, {
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
		return this.httpClient.client.post<ReponseJwt>(`${this.namespace}/auth/confirm_email/`, body);
	}

	/**
	 * Refresh token
	 * @param refreshToken refresh token from login method
	 * @returns new jwt tokens
	 */
	refreshToken(refreshToken: string) {
		return this.httpClient.client.post<ReponseJwt>(`${this.namespace}/auth/refresh_token/`, null, {
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
		return this.httpClient.client.post<ReponseJwt>(`${this.namespace}/auth/register/`, body);
	}

	/**
	 * Create user by invitation
	 * @returns jwt tokens
	 */
	signUp(body: ISignUpDto) {
		return this.httpClient.client.post<ReponseJwt>(`${this.namespace}/users/`, body);
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
}
