import { QueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs } from 'react-router';
import { getLevel } from './api/getLevel';

export function levelLoader(queryClient: QueryClient) {
    return async ({ params }: LoaderFunctionArgs) => {
        if (!params.levelID) throw new Error('Missing level ID');
        const levelID = parseInt(params.levelID);
        if (isNaN(levelID)) throw new Error('Level ID must be a number');

        const cached = queryClient.getQueryData(['level', levelID]);
        if (cached) return cached;

        const list = await getLevel(levelID);
        queryClient.setQueryData(['level', levelID], list);
        return list;
    };
}
