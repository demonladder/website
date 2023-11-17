import APIClient from '../../APIClient';

export function DeactivateBotRequest() {
    return APIClient.post('/bot/deactivate');
}