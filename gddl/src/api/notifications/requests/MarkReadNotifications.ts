import APIClient from '../../APIClient';

export function MarkReadNotifications(notifIDs: string[]) {
    if (notifIDs.length === 0) return;
    
    return APIClient.post('/notifications/markRead', { Notifications: notifIDs });
}