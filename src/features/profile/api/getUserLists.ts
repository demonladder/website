import APIClient from '../../../api/APIClient';
import { List } from '../../list/types/List';

export async function getUserLists(userID: number, order?: 'ID' | 'Name') {
    const res = await APIClient.get<List[]>(`/user/${userID}/lists`, { params: { sort: order } });
    return res.data;
}
