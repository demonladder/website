import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router';
import type { Level } from '../../api/types/Level';
import { getLevel } from '../level/api/getLevel';

export function submitLoader(queryClient: QueryClient) {
    return async ({ params }: LoaderFunctionArgs) => {
        if (!params.levelID) return null;

        const parsedID = parseInt(params.levelID);
        if (isNaN(parsedID)) throw new Error('Level ID is not a number');

        const cache = queryClient.getQueryData<Level>(['level', parsedID]);
        if (cache) return cache;

        const level = await getLevel(parsedID);
        queryClient.setQueryData(['level', parsedID], level);
        return level;
    };
}
