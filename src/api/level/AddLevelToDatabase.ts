import APIClient from '../APIClient';

export default async function AddLevelToDatabase(levelID: number) {
    await APIClient.post(`/level/${levelID}`);
}