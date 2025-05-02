import APIClient from '../APIClient';

export default async function UpdateRoleManagementSettings(setting: '1' | '2' | '3') {
    await APIClient.patch('/wants/roleManagement', { value: setting });
}
