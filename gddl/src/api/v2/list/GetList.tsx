import APIClient from '../../APIClient';
import List from '../../types/compounds/List';

export default async function GetList(listID: number) {
    const res = await APIClient.get<List>(`/v2/list/${listID}`);
    return res.data;
}