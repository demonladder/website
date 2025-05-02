import APIClient from '../APIClient';

export default async function MoveListLevel(listID: number, levelID: number, newPosition: number) {
    await APIClient.patch(`/list/${listID}/levels/${levelID}`, { newPosition });
}
