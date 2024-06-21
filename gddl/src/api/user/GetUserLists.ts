import APIClient from '../APIClient';
import List from '../types/List';

export default async function GetUserLists(userID: number, order?: 'ID' | 'Name') {
    const res = await APIClient.get<List[]>(`/user/${userID}/lists`, { params: { sort: order } });
    return res.data;
}