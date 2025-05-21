import APIClient from '../../../../api/APIClient';
import Role from '../../../../api/types/Role';

export async function getVerificationRole() {
    const res = await APIClient.get<Role>('/roles/verificationRole');
    return res.data;
}
