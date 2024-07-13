import APIClient from '../APIClient';

export default async function SignupToken(userID: number) {
    await APIClient.post('/signupToken', { userID });
}