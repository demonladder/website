import APIClient from '../APIClient';
import User from '../types/User';

export default async function SignUp(name: string, password: string, turnstileToken: string, overrideKey?: string) {
    const res = await APIClient.post<User>('/signup', {
        name,
        password,
        turnstileToken,
        overrideKey,
    });
    return res.data;
}
