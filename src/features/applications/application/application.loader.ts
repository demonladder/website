import { LoaderFunctionArgs } from 'react-router';
import { QueryClient } from '@tanstack/react-query';
import type { Application } from '../../../api/types/Application';
import { getApplication } from './api/getApplication';

export function applicationLoader(queryClient: QueryClient) {
    return async ({ params }: LoaderFunctionArgs) => {
        if (!params.appID) throw new Error('Missing application ID');

        const cache = queryClient.getQueryData<Application>(['applications', params.appID]);
        if (cache) return cache;

        const app = await getApplication(params.appID);
        queryClient.setQueryData(['applications', params.appID], app);
        return app;
    };
}
