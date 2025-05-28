import APIClient from '../../../../api/APIClient';

export async function addLevelFromGD(levelID: number) {
    await APIClient.post(`/level/${levelID}`);
}
