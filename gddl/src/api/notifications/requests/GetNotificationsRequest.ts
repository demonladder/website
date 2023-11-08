import StorageManager from '../../../utils/StorageManager';
import APIClient from '../../axios';

interface NotificationsRaw {
    ID: string;
    Message: string;
    IsRead: 0 | 1;
    SentAt: string;  // UTC timestamp
    ReadAt: string | null;  // UTC timestamp
}

export interface NotificationResponse {
    ID: string;
    Message: string;
    IsRead: boolean;
    SentAt: Date;
    ReadAt: Date | null;
}

export function GetNotifications(): Promise<NotificationResponse[]> {
    const csrfToken = StorageManager.getCSRF();
    return APIClient.get('/notifications', { withCredentials: true, params: { csrfToken } }).then((res) => {
        const data: NotificationsRaw[] = res.data;

        return data.map((notif) => ({
            ID: notif.ID,
            Message: notif.Message,
            IsRead: notif.IsRead === 1,
            SentAt: new Date((notif.SentAt + 'Z')),
            ReadAt: (notif.ReadAt !== null) ? new Date(notif.ReadAt) : null,
        }))
    });
}