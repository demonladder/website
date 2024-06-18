import APIClient from '../APIClient';

export default function DeleteUserRequest(ID: number) {
    return APIClient.delete(`/user/${ID}`);
}