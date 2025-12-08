import APIClient from '../../../api/APIClient';
import { List } from '../../list/types/List';

export interface GetUserListsResponse extends List {
    tags: number[];
}

export async function getUserLists(userID: number, order?: 'ID' | 'Name') {
    const res = await APIClient.get<GetUserListsResponse[]>(`/user/${userID}/lists`, { params: { sort: order } });
    return res.data;
}
