import APIClient from '../APIClient';

export interface TokenPair {
    Token: string;
    Name: string;
    Expiration: string;
}

export default async function GetSignupTokens() {
    const res = await APIClient.get<TokenPair[]>('/signupToken');
    return res.data;
}