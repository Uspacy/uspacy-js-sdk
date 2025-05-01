import { ResourceType } from '../models/resources';

export const getResourcesDomain = (type: ResourceType) =>
	window.location.origin.includes('stage') || window.location.origin.includes('localhost')
		? `https://${type}s.staging.uspacy.tech`
		: `https://${type}s.uspa.cy`;
