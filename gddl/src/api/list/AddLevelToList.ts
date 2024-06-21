import APIClient from '../APIClient';

export default async function AddLevelToList(levelID: number, listID: number) {
    await APIClient.post(`/list/${listID}/add`, { levelID });
}