import APIClient from '../../../../api/APIClient';

export async function updateVerificationRole(roleID: number | null) {
    await APIClient.patch('/verification/role', {
        roleID,
    });
}
