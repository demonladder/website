import APIClient from '../APIClient';

export default async function RemoveLevel(listID: number, levelID: number) {
    await APIClient.delete(`/list/${listID}/levels/`, { data: { levelID } });
}
