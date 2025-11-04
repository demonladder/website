export interface Notification {
    ID: string;
    Message: string;
    IsRead: boolean;
    SentAt: string; // UTC timestamp
    ReadAt: string | null; // UTC timestamp
}
