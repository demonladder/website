import APIClient from '../../../api/APIClient';
import { List } from '../types/List';

export async function editListDescription(listID: number, description: string) {
    const res = await APIClient.patch<List>(`/list/${listID}`, {
        description,
    });
    return res.data;
}
