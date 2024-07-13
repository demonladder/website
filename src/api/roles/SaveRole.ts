import APIClient from '../APIClient';

export default async function SaveRole(roleID: number, name?: string, permissions?: number) {
    await APIClient.patch(`/roles/${roleID}`, { name, permissions });
}