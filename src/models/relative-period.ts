export const RELATIVE_PERIOD_LABEL = 'customPeriod';

export type RelativePeriodDirection = 'past' | 'current' | 'future' | 'last' | 'next';
export type RelativePeriodUnit = 'day' | 'week' | 'month' | 'year';

export interface IRelativePeriod {
	direction: RelativePeriodDirection;
	count: number;
	unit: RelativePeriodUnit;
}
