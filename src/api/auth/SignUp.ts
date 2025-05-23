import APIClient from '../APIClient';
import User from '../types/User';

export default async function SignUp(name: string, password: string, overrideKey?: string) {
    const res = await APIClient.post<User>('/signup', {
        name,
        password,
        overrideKey,
    });
    return res.data;
}
