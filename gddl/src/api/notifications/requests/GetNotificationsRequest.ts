import APIClient from '../../APIClient';

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

export type UnreadFilter = 'all' | 'unread';

interface Options {
    allOrUnread?: UnreadFilter;
}

export function GetNotifications(options?: Options): Promise<NotificationResponse[]> {
    return APIClient.get('/notifications', { params: { ...options } }).then((res) => {
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