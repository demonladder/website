import APIClient from '../APIClient';

export default async function MarkAllReadRequest() {
    await APIClient.patch('/notifications/markAllRead');
}
