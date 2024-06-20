import APIClient from '../APIClient';

export default async function ActivateBotRequest() {
    await APIClient.post('/bot/activate');
}