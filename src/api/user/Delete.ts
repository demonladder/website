import type { AxiosInstance } from 'axios';

export default async function DeleteUserRequest(APIClient: AxiosInstance, ID: number) {
    await APIClient.delete(`/user/${ID}`);
}
