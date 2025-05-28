import APIClient from '../../../api/APIClient';

export async function moveListLevel(listID: number, levelID: number, newPosition: number) {
    await APIClient.patch(`/list/${listID}/levels/${levelID}`, { newPosition });
}
