import APIClient from '../APIClient';

export default async function MoveListLevel(listID: number, levelID: number, newPosition: number) {
    await APIClient.put(`/list/${listID}/moveLevel`, { levelID, newPosition });
}