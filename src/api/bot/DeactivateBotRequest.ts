import APIClient from '../APIClient';

export default async function DeactivateBotRequest() {
    await APIClient.post('/bot/deactivate');
}
