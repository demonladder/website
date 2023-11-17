import APIClient from '../../APIClient';

export async function CreatePackRequest(name: string){
    return await APIClient.post('/packs/create', { name });
}