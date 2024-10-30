import APIClient from '../../APIClient';

export default async function ReRollDecathlonLevel() {
    await APIClient.post('/decathlon/reRoll');
}