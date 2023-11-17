import APIClient from '../../APIClient';

export default function DeletePackRequest(packID: number) {
    return APIClient.delete('/pack', { params: { packID } });
}