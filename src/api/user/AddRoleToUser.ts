import APIClient from '../APIClient';

export default async function AddRoleToUser(userID: number, roleID: number) {
    await APIClient.post(`/user/${userID}/roles`, {
        roleID,
    });
}