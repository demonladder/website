import APIClient from '../../APIClient';

export default async function CreatePackRequest(name: string){
    await APIClient.post('/packs/create', { name });
}