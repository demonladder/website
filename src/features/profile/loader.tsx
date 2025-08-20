import { redirect } from 'react-router';
import APIClient from '../../api/APIClient';

export async function profileLoader() {
    return APIClient.get('/user/me')
        .then(() => null)
        .catch(() => redirect('/signup'));
}
