import APIClient from '../APIClient';

export default async function RemoveLevel(levelID: number) {
    await APIClient.delete(`/level/${levelID}`);
}