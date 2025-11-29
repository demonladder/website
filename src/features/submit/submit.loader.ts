import type { QueryClient } from '@tanstack/react-query';
import { redirect, type LoaderFunctionArgs } from 'react-router';
import type { Level } from '../../api/types/Level';
import { getLevel } from '../level/api/getLevel';
import GetMe from '../../api/auth/GetMe';
import { routes } from '../../routes/route-definitions';

export function submitLoader(queryClient: QueryClient) {
    return async ({ params }: LoaderFunctionArgs) => {
        if (!params.levelID) return null;

        const parsedID = parseInt(params.levelID);
        if (isNaN(parsedID)) throw new Error('Level ID is not a number');

        try {
            await GetMe();
        } catch {
            return redirect(`/login?redirect=${routes.submit.level.href(parsedID)}`);
        }

        const cache = queryClient.getQueryData<Level>(['level', parsedID]);
        if (cache) return cache;

        const level = await getLevel(parsedID);
        queryClient.setQueryData(['level', parsedID], level);
        return level;
    };
}
