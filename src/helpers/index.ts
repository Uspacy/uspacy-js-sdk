import { IMassActions } from '../models/crm-mass-actions';
import { ResourceType } from '../models/resources';

export const getResourcesDomain = (typeProps: ResourceType) => {
	const type = typeProps === 'calendar' ? 'form' : typeProps;

	return window.location.origin.includes('stage') || window.location.origin.includes('localhost')
		? `https://${type}s.staging.uspacy.tech`
		: `https://${type}s.uspa.cy`;
};

/**
 * Build the common part of a mass action body.
 * When all is true the ids are omitted, so the backend applies the action to the whole filtered selection
 * instead of the ids of the currently loaded page
 * @param entityIds entity ids to apply the action to
 * @param exceptIds entity ids to exclude from the action
 * @param all should apply the action to all entities matching the filters
 * @param idsKey body key for the ids
 */
export const getMassActionsData = ({ entityIds, exceptIds, all }: Pick<IMassActions, 'entityIds' | 'exceptIds' | 'all'>, idsKey = 'entity_ids') => ({
	all,
	...(all ? {} : { [idsKey]: entityIds }),
	except_ids: exceptIds,
});
