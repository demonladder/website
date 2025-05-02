import APIClient from '../APIClient';
import SignupToken from '../types/SignupToken';
import User from '../types/User';

interface GetSignupTokensResponse extends SignupToken {
    User: User;
}

export default async function GetSignupTokens() {
    const res = await APIClient.get<GetSignupTokensResponse[]>('/signupTokens');
    return res.data;
}
