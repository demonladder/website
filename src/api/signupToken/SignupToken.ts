import APIClient from '../APIClient';

export default async function CreateSignupToken(options: { userID: number; discordID?: string }) {
    await APIClient.post('/signupTokens', options);
}
