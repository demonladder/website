import APIClient from '../../../../api/APIClient';

export async function addLevelFromGD(levelID: number) {
    await APIClient.post(`/levels/${levelID}`, undefined, {
        timeout: 30_000,
    });
}
