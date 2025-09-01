import { type LoaderFunctionArgs } from 'react-router';
import APIClient from '../../../api/APIClient';

export async function AuthorizeLoader({ request }: LoaderFunctionArgs) {
    const queryParams = new URL(request.url).searchParams;

    const clientID = queryParams.get('client_id');

    try {
        return (
            await APIClient.get<{ name: string; botID: number; createdAt: string }>(`/oauth/2/applications/${clientID}`)
        ).data;
    } catch {
        return null;
    }
}
