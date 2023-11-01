import APIClient from '../../axios';
import { Tag } from '../../types/level/Tag';

export function GetTags(): Promise<{[key: string]: string}> {
    return APIClient.get('/tags').then((res) => {
        return (res.data as Tag[]).reduce((acc, t) => {
            return {
                ...acc,
                [t.TagID]: t.Name,
            };
        }, {
            '-1': '-Remove all-',
            0: 'Vote here',
        });
    });
}