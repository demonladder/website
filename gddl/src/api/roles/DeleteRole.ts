import APIClient from '../APIClient';

export default async function DeleteRole(roleID: number) {
    await APIClient.delete(`/roles/${roleID}`);
}