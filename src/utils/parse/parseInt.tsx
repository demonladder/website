import _ from 'lodash';

export function parseInt(value: string): number | undefined {
    const parsed = _.parseInt(value);

    if (isNaN(parsed)) return undefined;
    return parsed;
}
