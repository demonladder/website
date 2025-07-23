import APIClient from '../../../api/APIClient';

export async function deleteNotification(notificationID: string): Promise<void> {
    await APIClient.delete(`/notifications/${notificationID}`);
}
