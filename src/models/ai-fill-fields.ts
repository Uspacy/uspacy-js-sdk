import { AxiosError } from 'axios';

/**
 * Outcome codes for getCallFillFields. Every failure resolves to exactly one of these.
 */
export type CallFillFieldsErrorCode = 'invalid_input' | 'no_access' | 'not_found' | 'too_large' | 'unavailable' | 'timed_out';

/**
 * Parameters for getCallFillFields.
 */
export interface ICallFillFieldsParams {
	/**
	 * The call transcript exactly as stored on the call (a formatted dialog).
	 */
	text: string;
	/**
	 * The open record's CRM entity type (e.g. `leads`, `deals`, `contacts`, `companies`, or a custom entity name).
	 * Must match `^[a-z0-9_]{1,64}$`; anything else is rejected as `invalid_input`.
	 */
	entityType: string;
	/**
	 * id of the open record
	 */
	entityId: number;
	/**
	 * Call start time as RFC 3339 with offset (e.g. `2026-09-21T10:15:00+03:00`); without it, date fields are not suggested.
	 */
	callStartedAt?: string;
	/**
	 * An IANA time-zone name for the call, used together with `callStartedAt`. When omitted, the
	 * offset of `callStartedAt` is used.
	 */
	timeZone?: string;
}

/**
 * A single phone or email suggestion. Phone and email entries never carry `id` or `main`.
 */
export interface ICallFillFieldsContactEntry {
	value: string;
	type: string;
}

/**
 * A single messenger (social) suggestion. Messenger entries never carry `id` or `main`.
 */
export interface ICallFillFieldsMessengerEntry {
	name: string;
	link: string;
}

/**
 * A money field suggestion. `currency` is ISO 4217, `value` is unsigned and dot-decimal (never exponent notation).
 */
export interface ICallFillFieldsMoney {
	currency: string;
	value: string;
}

/**
 * A suggested value for one field of `entity_data`. The shape depends on the field's kind:
 * text/address/link/list/label as a string, integer/float/datetime as a number, boolean as a
 * boolean (never multi-value), phone/email as `ICallFillFieldsContactEntry`, money as
 * `ICallFillFieldsMoney`, and messengers as `ICallFillFieldsMessengerEntry` — each singular for a
 * single-value field, or as an array when the field is multi-value.
 */
export type CallFillFieldsValue =
	| string
	| number
	| boolean
	| string[]
	| number[]
	| ICallFillFieldsContactEntry
	| ICallFillFieldsContactEntry[]
	| ICallFillFieldsMessengerEntry
	| ICallFillFieldsMessengerEntry[]
	| ICallFillFieldsMoney
	| ICallFillFieldsMoney[];

/**
 * Counters describing how much of the record and transcript were actually used.
 */
export interface ICallFillFieldsMeta {
	fields_considered: number;
	fields_not_considered: number;
	transcript_shortened: boolean;
	/**
	 * True when a multi-value field had more than 10 valid new entries and some were left out.
	 */
	entries_left_out: boolean;
}

/**
 * Response of getCallFillFields.
 */
export interface ICallFillFieldsResponse {
	entity_type: string;
	entity_id: number;
	/**
	 * Suggested values keyed by field code. A single-value field's suggestion can be PATCHed as it
	 * is. A multi-value field's suggestions are NEW entries (no `id`) — they must be sent to PATCH
	 * together with the record's kept existing entries (each with its own `id`), or the CRM
	 * removes the entries left out.
	 */
	entity_data: Record<string, CallFillFieldsValue>;
	/**
	 * Verbatim transcript fragments per field code, aligned by index with `entity_data`:
	 * `evidence[code][i]` backs `entity_data[code][i]`. A single-value field has exactly one entry.
	 */
	evidence: Record<string, string[][]>;
	meta: ICallFillFieldsMeta;
	request_id: string;
}

/**
 * Error body returned by the fill-fields endpoint. `code` and `request_id` are absent for
 * failures raised outside the handler (e.g. the gateway/auth middleware's 403), which `resolveCallFillFieldsErrorCode` covers.
 * `error` is absent too when the body isn't JSON at all: gin's crash handler returns a 500 with
 * an empty body, and a proxy-generated 413/504 body is plain text.
 */
export interface ICallFillFieldsErrorResponse {
	code?: CallFillFieldsErrorCode;
	error?: string;
	request_id?: string;
}

/**
 * Membership map for every `CallFillFieldsErrorCode`, keyed by the code itself. Typing it as
 * `Record<CallFillFieldsErrorCode, true>` makes tsc reject the object if a code is missing or
 * misspelled, so a code added to the union without being added here fails to compile.
 */
const CALL_FILL_FIELDS_ERROR_CODES: Record<CallFillFieldsErrorCode, true> = {
	invalid_input: true,
	no_access: true,
	not_found: true,
	too_large: true,
	unavailable: true,
	timed_out: true,
};

const CALL_FILL_FIELDS_STATUS_CODES: Partial<Record<number, CallFillFieldsErrorCode>> = {
	400: 'invalid_input',
	403: 'no_access',
	404: 'not_found',
	413: 'too_large',
	504: 'timed_out',
};

/**
 * Resolve a getCallFillFields failure to one of the six outcome codes.
 *
 * Uses `error.response.data.code` when the backend already classified the failure. Otherwise it
 * falls back to the HTTP status (400 invalid_input, 403 no_access, 404 not_found, 413 too_large,
 * 504 timed_out), then to a client-side timeout (`error.code === 'ECONNABORTED'` or `'ETIMEDOUT'`),
 * and finally to `unavailable`, which also covers a missing response (network error, CORS, a
 * proxy failure, etc). Both timeout codes are checked: axios raises `ETIMEDOUT` instead of
 * `ECONNABORTED` when `transitional.clarifyTimeoutError` is set, and always from the fetch adapter.
 *
 * @param error the AxiosError raised by getCallFillFields
 * @returns `invalid_input`, `no_access`, `not_found`, `too_large`, `timed_out` or `unavailable`
 */
export const resolveCallFillFieldsErrorCode = (error: AxiosError<ICallFillFieldsErrorResponse>): CallFillFieldsErrorCode => {
	const code = error.response?.data?.code;

	if (code && Object.prototype.hasOwnProperty.call(CALL_FILL_FIELDS_ERROR_CODES, code)) {
		return code;
	}

	const status = error.response?.status;
	const statusCode = status ? CALL_FILL_FIELDS_STATUS_CODES[status] : undefined;

	if (statusCode) {
		return statusCode;
	}

	if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
		return 'timed_out';
	}

	return 'unavailable';
};
