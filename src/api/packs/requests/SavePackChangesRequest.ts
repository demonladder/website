import { Change } from '../../../pages/mod/pack/types/Change';
import APIClient from '../../APIClient';

export default async function SavePackChangesRequest(changes: Change[]) {
    const additions = changes.filter((c) => c.Type === 'add');
    const removals = changes.filter((c) => c.Type === 'remove');

    if (additions.length > 0) await APIClient.patch(`/packs/levels`, {
        changes: additions.map((c) => ({
            levelID: c.LevelID,
            packID: c.PackID,
            EX: c.EX,
        })),
    });

    for (const removal of removals) {
        await APIClient.delete(`/packs/${removal.PackID}/levels/${removal.LevelID}`);
    }
}
