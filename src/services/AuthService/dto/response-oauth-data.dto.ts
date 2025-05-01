export interface IResponseOauthData {
	state: string;
	code: string;
	scope?: string;
	authuser?: string;
	prompt?: string;
}
