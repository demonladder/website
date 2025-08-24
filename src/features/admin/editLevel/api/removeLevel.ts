import APIClient from '../../../../api/APIClient';

export async function removeLevel(levelID: number) {
    await APIClient.delete(`/level/${levelID}`);
}
