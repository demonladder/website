import APIClient from '../APIClient';

export default async function MarkReadNotifications(notifIDs: string[]) {
    if (notifIDs.length === 0) return;
    
    await APIClient.patch('/notifications/markRead', { notifications: notifIDs });
}
