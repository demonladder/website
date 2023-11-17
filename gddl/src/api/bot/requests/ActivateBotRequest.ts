import APIClient from '../../APIClient';

export function ActivateBotRequest() {
    return APIClient.post('/bot/activate');
}