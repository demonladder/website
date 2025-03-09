import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import GetSinglePack from '../../../../api/pack/requests/GetSinglePack';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import Container from '../../../../components/Container';
import Level from '../../../../components/Level';
import useLevelView from '../../../../hooks/useLevelView';
import { GridLevel } from '../../../../components/GridLevel';
import Leaderboard from '../Leaderboard';
import GetPackLevels from '../../../../api/pack/requests/GetPackLevels';
// import GDDLP from './GDDLP';

export default function PackOverview() {
    const packID = parseInt(useParams().packID ?? '') || 0;
    const { status, data: pack } = useQuery({
        queryKey: ['packs', packID],
        queryFn: () => GetSinglePack(packID),
    });
    const { status: levelStatus, data: packLevels } = useQuery({
        queryKey: ['packs', packID, 'levels'],
        queryFn: () => GetPackLevels(packID),
    });

    const [isList, viewButtons] = useLevelView();

    if (status === 'loading' || levelStatus === 'loading') {
        return <LoadingSpinner />;
    } else if (status === 'error' || levelStatus === 'error') {
        return (
            <Container className='bg-gray-800'>
                <h1>An error occurred</h1>
            </Container>
        )
    }

    // if (packID === 6) {
    //     return <GDDLP pack={pack} />;
    // }

    const exLevels = packLevels.filter((lvl) => lvl.EX);

    return (
        <Container className='bg-gray-800'>
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
                ? (
                    <div className='level-list my-3 mb-8'>
                        <Level.Header />
                        {packLevels.filter((l) => !l.EX).map((l) => (
                            <Level ID={l.LevelID} rating={l.Level.Rating} enjoyment={l.Level.Enjoyment} name={l.Level.Meta.Name} creator={l.Level.Meta.Creator} songName={l.Level.Meta.Song.Name} completed={l.Completed === 1} key={l.LevelID} />
                        ))}
                    </div>
                )
                : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 my-3 mb-8'>
                        {packLevels.filter((l) => !l.EX).map((l) => (
                            <GridLevel ID={l.LevelID} rating={l.Level.Rating} enjoyment={l.Level.Enjoyment} name={l.Level.Meta.Name} creator={l.Level.Meta.Creator} difficulty={l.Level.Meta.Difficulty} inPack={false} key={l.LevelID} />
                        ))}
                    </div>
                )
            }

            {exLevels.length > 0 && <>
                <h3 className='mb-3'>The following demons are not required for pack completion:</h3>
                {isList
                    ? (
                        <div className='level-list my-3 mb-8'>
                            <Level.Header />
                            {exLevels.map((l) => (
                                <Level ID={l.LevelID} rating={l.Level.Rating} enjoyment={l.Level.Enjoyment} name={l.Level.Meta.Name} creator={l.Level.Meta.Creator} songName={l.Level.Meta.Song.Name} key={l.LevelID} />
                            ))}
                        </div>
                    )
                    : (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 my-3 mb-8'>
                            {exLevels.map((l) => (
                                <GridLevel ID={l.LevelID} rating={l.Level.Rating} enjoyment={l.Level.Enjoyment} name={l.Level.Meta.Name} creator={l.Level.Meta.Creator} difficulty={l.Level.Meta.Difficulty} inPack={false} key={l.LevelID} />
                            ))}
                        </div>
                    )
                }
            </>}
            <Leaderboard packID={packID} />
        </Container>
    );
}
