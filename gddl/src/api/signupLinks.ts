import APIClient from './APIClient';

export type TokenPair = {
    Token: string,
    Name: string,
    Expiration: string;
}

export async function SignupToken(userID: number): Promise<void> {
    await APIClient.post('/signupToken', { userID });
}

export async function GetSignupTokens(): Promise<TokenPair[]> {
    const res = await APIClient.get('/signupToken');
    return res.data;
}