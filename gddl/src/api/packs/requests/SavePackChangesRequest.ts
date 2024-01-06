import { Change } from '../../../pages/mod/pack/types/Change';
import APIClient from '../../APIClient';

export function SavePackChangesRequest(packID: number, changes: Change[]) {
    return APIClient.post('/packs/edit/' + packID, { changes });
}