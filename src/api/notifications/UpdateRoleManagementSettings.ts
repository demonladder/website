import APIClient from '../APIClient';

export default async function UpdateRoleManagementSettings(setting: string) {
    await APIClient.put('/notifications/wants/roleManagement', { value: setting });
}