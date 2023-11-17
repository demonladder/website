import APIClient from './APIClient';

export type TokenPair = {
    Token: string,
    UserName: string,
}

export async function SignupToken(username: string): Promise<void> {
    await APIClient.post('/signupToken', { username });
}

export async function GetSignupTokens(): Promise<TokenPair[]> {
    const res = await APIClient.get('/signupToken');
    return res.data;
}