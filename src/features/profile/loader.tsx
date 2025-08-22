import { LoaderFunctionArgs, redirect } from 'react-router';
import { QueryClient } from '@tanstack/react-query';
import GetMe from '../../api/auth/GetMe';
import GetUser from '../../api/user/GetUser';
import User from '../../api/types/User';

export function profileLoader(queryClient: QueryClient) {
    return async ({ params }: LoaderFunctionArgs) => {
        if (!params.userID) {
            const cache = queryClient.getQueryData<User>(['me']);
            if (cache) return redirect(`/profile/${cache.ID}`);

            return await GetMe()
                .then((user) => {
                    queryClient.setQueryData(['me'], user);
                    return redirect(`/profile/${user.ID}`);
                })
                .catch(() => redirect('/signup'));
        }

        const parsedID = parseInt(params.userID);
        if (isNaN(parsedID)) throw new Error('User ID is not a number');

        const cache = queryClient.getQueryData<User>(['user', parsedID]);
        if (cache) return cache;

        const user = await GetUser(parsedID);
        queryClient.setQueryData(['user', parsedID], user);
        return user;
    };
}
