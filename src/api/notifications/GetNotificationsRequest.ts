import APIClient from '../APIClient';

interface NotificationsRaw {
    ID: string;
    Message: string;
    IsRead: boolean;
    SentAt: string; // UTC timestamp
    ReadAt: string | null; // UTC timestamp
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

export default async function GetNotifications(options?: Options): Promise<NotificationResponse[]> {
    const res = await APIClient.get<NotificationsRaw[]>('/notifications', { params: { ...options } });

    return res.data.map((notif) => ({
        ID: notif.ID,
        Message: notif.Message,
        IsRead: notif.IsRead,
        SentAt: new Date(notif.SentAt),
        ReadAt: notif.ReadAt !== null ? new Date(notif.ReadAt) : null,
    }));
}
