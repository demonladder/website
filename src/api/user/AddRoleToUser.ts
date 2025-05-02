import APIClient from '../APIClient';

export default async function AddRoleToUser(userID: number, roleID: number) {
    await APIClient.post(`/roles/${roleID}/users/${userID}`);
}
