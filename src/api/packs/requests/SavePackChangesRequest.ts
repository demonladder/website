import { Change } from '../../../pages/mod/pack/types/Change';
import APIClient from '../../APIClient';

export default async function SavePackChangesRequest(changes: Change[]) {
    await APIClient.post(`/packs/levels`, changes.map((c) => ({
        LevelID: c.LevelID,
        PackID: c.PackID,
        Type: c.Type,
        EX: c.EX,
    })));
}