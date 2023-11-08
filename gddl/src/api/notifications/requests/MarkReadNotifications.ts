import StorageManager from "../../../utils/StorageManager";
import APIClient from "../../axios";

export function MarkReadNotifications(notifIDs: string[]) {
    const csrfToken = StorageManager.getCSRF();
    return APIClient.post('/notifications/markRead', { csrfToken, Notifications: notifIDs }, { withCredentials: true });
}