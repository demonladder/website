import APIClient from '../../../../api/APIClient';

export async function saveRole(roleID: number, color: number | null, name?: string, permissions?: number) {
    await APIClient.patch(`/roles/${roleID}`, { name, color, permissions });
}
