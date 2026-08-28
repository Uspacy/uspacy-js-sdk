/**
 * Payload for setting the current user's Slack-like custom status.
 * `emoji` is required; `removeStatusAfter` is a future unix timestamp in seconds
 * (or null / omitted for a status that never expires).
 */
export interface ISetUserStatusDto {
	emoji: string;
	title?: string | null;
	description?: string | null;
	removeStatusAfter?: number | null;
}
