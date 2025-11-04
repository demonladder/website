import APIClient from '../APIClient';

export default async function RemoveRoleFromUser(userID: number, roleID: number) {
    await APIClient.delete(`/roles/${roleID}/users/${userID}`);
}
