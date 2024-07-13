import APIClient from '../APIClient';

export default async function DeleteUserRequest(ID: number) {
    await APIClient.delete(`/user/${ID}`);
}