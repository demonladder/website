import APIClient from '../../../api/APIClient';

export default async function addLevelToList(levelID: number, listID: number) {
    await APIClient.post(`/list/${listID}/levels`, { levelID });
}
