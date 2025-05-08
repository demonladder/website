import APIClient from '../APIClient';

export default async function SaveRole(roleID: number, color: number | null, name?: string, permissions?: number) {
    await APIClient.patch(`/roles/${roleID}`, { name, color, permissions });
}
