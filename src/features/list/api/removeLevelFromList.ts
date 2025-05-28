import APIClient from '../../../api/APIClient';

export async function removeLevelFromList(listID: number, levelID: number) {
    await APIClient.delete(`/list/${listID}/levels/`, { data: { levelID } });
}
