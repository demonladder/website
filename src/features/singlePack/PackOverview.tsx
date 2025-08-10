import { useParams } from 'react-router-dom';
import Level from '../../components/Level';
import useLevelView from '../../hooks/useLevelView';
import { GridLevel } from '../../components/GridLevel';
import Leaderboard from '../packs/components/Leaderboard';
import usePackLevels from './hooks/usePackLevels';
import Page from '../../components/Page';
import usePack from './hooks/usePack';
import { LevelRenderer } from '../../components/LevelRenderer';
import Heading1 from '../../components/headings/Heading1';
import FloatingLoadingSpinner from '../../components/FloatingLoadingSpinner';
import Heading3 from '../../components/headings/Heading3';

export default function PackOverview() {
    const packID = parseInt(useParams().packID ?? '') || 0;
    const { status, data: pack } = usePack(packID);
    const { status: levelStatus, data: packLevels } = usePackLevels(packID);

    const [isList, viewButtons] = useLevelView('packs.listView');

    if (status === 'pending' || levelStatus === 'pending') return <FloatingLoadingSpinner />;
    if (status === 'error' || levelStatus === 'error') return <Page><Heading1>Error: could not fetch pack</Heading1></Page>;

    const normalLevels = packLevels.filter((lvl) => !lvl.EX).map((level) => ({ ...level.Level, ID: level.LevelID, Completed: level.Completed }));
    const exLevels = packLevels.filter((lvl) => lvl.EX).map((level) => ({ ...level.Level, ID: level.LevelID, Completed: level.Completed }));

    return (
        <Page>
            <div className='flex gap-2 mb-4'>
                <div>
                    {pack.IconName && <img src={'/packIcons/' + pack.IconName} style={{ minWidth: '64px' }} />}
                </div>
                <div>
                    <Heading1 className='mb-1'>{pack.Name}</Heading1>
                    <p>{pack.Description}</p>
                </div>
            </div>
            <div>
                {viewButtons}
            </div>
            {isList
                ? <LevelRenderer element={Level} className='level-list my-3 mb-8' levels={normalLevels} />
                : <LevelRenderer element={GridLevel} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 my-3 mb-8' levels={normalLevels} />
            }
            {exLevels.length > 0 && <>
                <Heading3 className='mb-3'>The following demons are not required for pack completion:</Heading3>
                {isList
                    ? <LevelRenderer element={Level} className='level-list my-3 mb-8' levels={exLevels} />
                    : <LevelRenderer element={GridLevel} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 my-3 mb-8' levels={exLevels} />
                }
            </>}
            <Leaderboard packID={packID} />
        </Page>
    );
}
