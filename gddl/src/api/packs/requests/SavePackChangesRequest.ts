import { Change } from '../../../pages/mod/pack/types/Change';
import StorageManager from '../../../utils/StorageManager';
import APIClient from '../../axios';

export function SavePackChangesRequest(changes: Change[]) {
    const csrfToken = StorageManager.getCSRF();
    return APIClient.post('/packs/edit', { changes, csrfToken }, { withCredentials: true});
}