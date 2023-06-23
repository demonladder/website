import instance from "./axios";

export type TokenPair = {
    Token: string,
    UserName: string,
}

export async function SignupToken(tokenPair: TokenPair): Promise<void> {
    await instance.post('/signupToken', { token: tokenPair.Token, username: tokenPair.UserName }, { withCredentials: true });
}

export async function GetSignupTokens(): Promise<TokenPair[]> {
    const res = await instance.get('/signupTokens', { withCredentials: true });
    return res.data;
}