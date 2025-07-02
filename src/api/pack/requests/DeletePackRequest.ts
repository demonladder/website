import APIClient from '../../APIClient';

export default async function DeletePackRequest(packID: number) {
    await APIClient.delete(`/packs/${packID}`);
}
