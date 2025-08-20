import { QueryClient } from '@tanstack/react-query';
import { getList } from './api/getList';
import { LoaderFunctionArgs } from 'react-router';

export function listLoader(queryClient: QueryClient) {
    return async ({ params }: LoaderFunctionArgs) => {
        if (!params.listID) throw new Error('Missing list ID');
        const listID = parseInt(params.listID);
        if (isNaN(listID)) throw new Error('List ID must be a number');

        const list = await getList(listID);
        queryClient.setQueryData(['list', listID], list);
        return list;
    };
}
