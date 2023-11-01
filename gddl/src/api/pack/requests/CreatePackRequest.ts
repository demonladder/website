import StorageManager from '../../../utils/StorageManager';
import APIClient from '../../axios';

export async function CreatePackRequest(name: string){
    const csrfToken = StorageManager.getCSRF();
    return await APIClient.post('/packs/create', { name }, { withCredentials: true, params: { csrfToken }});
}