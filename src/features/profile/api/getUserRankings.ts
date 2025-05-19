import APIClient from '../../../api/APIClient';

export  async function getUserRankings(userID: number) {
    const res = await APIClient.get<Record<string, { Count: number, Total: number }>>(`/user/${userID}/rank`);
    return res.data;
}
