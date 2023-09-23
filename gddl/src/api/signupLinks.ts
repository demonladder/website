import StorageManager from "../utils/storageManager";
import APIClient from "./axios";

export type TokenPair = {
    Token: string,
    UserName: string,
}

export async function SignupToken(username: string): Promise<void> {
    const csrfToken = StorageManager.getCSRF();
    await APIClient.post('/signupToken', { username }, { withCredentials: true, params: { csrfToken } });
}

export async function GetSignupTokens(): Promise<TokenPair[]> {
    const csrfToken = StorageManager.getCSRF();
    const res = await APIClient.get('/signupToken', { withCredentials: true, params: { csrfToken } });
    return res.data;
}