import APIClient from '../../../../api/APIClient';

export async function deleteRole(roleID: number) {
    await APIClient.delete(`/roles/${roleID}`);
}
