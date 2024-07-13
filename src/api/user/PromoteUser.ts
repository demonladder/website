import APIClient from '../APIClient';

export default async function PromoteUser(userID: number, permissionLevel: number) {
    await APIClient.put('/user/promote', { userID, permissionLevel });
}