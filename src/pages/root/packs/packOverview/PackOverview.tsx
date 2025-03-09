import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import Level from '../../../../components/Level';
import useLevelView from '../../../../hooks/useLevelView';
import { GridLevel } from '../../../../components/GridLevel';
import Leaderboard from '../Leaderboard';
import GetPackLevels from '../../../../api/pack/requests/GetPackLevels';
import Page from '../../../../components/Page';
import usePack from '../../../../hooks/api/usePack';
import { LevelRenderer } from '../../../../components/LevelRenderer';
// import GDDLP from './GDDLP';

export default function PackOverview() {
    return (
        <Page>
            <Content />
        </Page>
    );
}

function Content() {
    const packID = parseInt(useParams().packID ?? '') || 0;
    const { status, data: pack } = usePack(packID);
    const { status: levelStatus, data: packLevels } = useQuery({
        queryKey: ['packs', packID, 'levels'],
        queryFn: () => GetPackLevels(packID),
    });

    const [isList, viewButtons] = useLevelView('packs.listView');

    if (status === 'loading' || levelStatus === 'loading') return <LoadingSpinner />;
    if (status === 'error' || levelStatus === 'error') return <h1 className='text-4xl'>Error: could not fetch pack</h1>;

    // if (packID === 6) {
    //     return <GDDLP pack={pack} />;
    // }

    const normalLevels = packLevels.filter((lvl) => !lvl.EX).map((level) => ({ ...level.Level, ID: level.LevelID, Completed: level.Completed }));
    const exLevels = packLevels.filter((lvl) => lvl.EX).map((level) => ({ ...level.Level, ID: level.LevelID, Completed: level.Completed }));

    return (
        <>
            <div className='flex gap-2 mb-4'>
                <div>
                    {pack.IconName && <img src={'/packIcons/' + pack.IconName} style={{ minWidth: '64px' }} />}
                </div>
                <div>
                    <h1 className='text-4xl mb-1'>{pack.Name}</h1>
                    <p>{pack.Description}</p>
                </div>
            </div>
            <div>
                {viewButtons}
            </div>
            {isList
                ? <LevelRenderer element={Level} className='level-list my-3 mb-8' header={<Level.Header />} levels={normalLevels} />
                : <LevelRenderer element={GridLevel} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 my-3 mb-8' levels={normalLevels} />
            }
            {exLevels.length > 0 && <>
                <h3 className='mb-3'>The following demons are not required for pack completion:</h3>
                {isList
                    ? <LevelRenderer element={Level} className='level-list my-3 mb-8' header={<Level.Header />} levels={exLevels} />
                    : <LevelRenderer element={GridLevel} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 my-3 mb-8' levels={exLevels} />
                }
            </>}
            <Leaderboard packID={packID} />
        </>
    );
}
