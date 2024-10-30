import APIClient from '../../APIClient';

export default async function GenerateDecathlon() {
    await APIClient.post('/decathlon');
}