import StorageManager from "../../../utils/StorageManager";
import APIClient from "../../axios";

export function MarkReadNotifications(notifIDs: string[]) {
    if (notifIDs.length === 0) return;
    
    const csrfToken = StorageManager.getCSRF();
    return APIClient.post('/notifications/markRead', { csrfToken, Notifications: notifIDs }, { withCredentials: true });
}