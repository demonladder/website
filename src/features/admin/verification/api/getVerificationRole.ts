import APIClient from '../../../../api/APIClient';
import Role from '../../../../api/types/Role';

export async function getVerificationRole() {
    const res = await APIClient.get<Role>('/verification/role');
    return res.data;
}
