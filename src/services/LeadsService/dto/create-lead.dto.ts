/**
 * Create Lead DTO
 * @param comments lead's comment
 * @param email emails array
 * @param first_name lead first name
 * @param last_name lead last name
 * @param lead_label lead label
 * @param messengers lead messengers array
 * @param owner lead owner
 * @param owner lead phone array
 * @param source lead source
 * @param title lead title
 */

import { ILetter } from '../../../models/email';

export interface ICreatedLeadBody {
	comments?: string;
	email?: { type: string; value: string; main?: boolean; sort?: string; id?: string }[];
	first_name?: string;
	last_name?: string;
	lead_label?: string;
	messengers?: [];
	owner?: number;
	phone?: { type: string; value: string; sort?: string; id?: string }[];
	external_channels?: { type: string; value: string; sort?: string; id?: string }[];
	source?: string;
	title: string;
	letters?: ILetter[];
	funnel_id?: number;
}
