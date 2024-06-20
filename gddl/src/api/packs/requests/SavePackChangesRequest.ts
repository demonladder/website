import { Change } from '../../../pages/mod/pack/types/Change';
import APIClient from '../../APIClient';

export default async function SavePackChangesRequest(packID: number, changes: Change[]) {
    await APIClient.post('/packs/edit/' + packID, { changes });
}