import APIClient from '../APIClient';
import User from '../types/User';

export default async function SignUp(username: string, password: string, overrideKey?: string) {
    const res = await APIClient.post<User>('/auth/signup', {
        username,
        password,
        overrideKey,
    });
    return res.data;
}
