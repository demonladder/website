import APIClient from '../../APIClient';

export default async function NextDecathlonLevel() {
    await APIClient.post('/decathlon/advance');
}
