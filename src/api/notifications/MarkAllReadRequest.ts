import APIClient from '../APIClient';

export default async function MarkAllReadRequest() {
    await APIClient.post('/notifications/markAllRead');
}
