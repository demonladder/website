import APIClient from '../APIClient';

export default async function CreateSignupToken(userID: number) {
    await APIClient.post('/signupTokens', { userID });
}
