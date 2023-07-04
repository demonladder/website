import { StorageManager } from "../storageManager";
import instance from "./axios";

export type TokenPair = {
    Token: string,
    UserName: string,
}

export async function SignupToken(tokenPair: TokenPair): Promise<void> {
    const csrfToken = StorageManager.getCSRF();
    await instance.post('/signupToken', { token: tokenPair.Token, username: tokenPair.UserName }, { withCredentials: true, params: { csrfToken } });
}

export async function GetSignupTokens(): Promise<TokenPair[]> {
    const csrfToken = StorageManager.getCSRF();
    const res = await instance.get('/signupTokens', { withCredentials: true, params: { csrfToken } });
    return res.data;
}