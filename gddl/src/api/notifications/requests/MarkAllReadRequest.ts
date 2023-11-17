import APIClient from '../../APIClient';

export function MarkAllReadRequest() {
    return APIClient.post('/notifications/markAllRead');
}