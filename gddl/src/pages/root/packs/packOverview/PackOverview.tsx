import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { GetSinglePack } from '../../../../api/pack/requests/GetSinglePack';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import Container from '../../../../components/Container';
import Level from '../../../../components/Level';
import useLevelView from '../../../../hooks/useLevelView';
import { GridLevel } from '../../../../components/GridLevel';

export default function PackOverview() {
    const packID = parseInt(''+useParams().packID) || 0;
    const { status, data: pack } = useQuery({
        queryKey: ['packs', packID],
        queryFn: () => GetSinglePack(packID),
    });

    const [isList, viewButtons] = useLevelView();

    if (status === 'loading') {
        return <LoadingSpinner />;
    } else if (status === 'error') {
        return (
            <Container className='bg-gray-800'>
                <h1>An error occurred</h1>
            </Container>
        )
    }

    const exLevels = pack.Levels.filter((lvl) => lvl.EX);
    
    return (
        <Container className='bg-gray-800'>
            <Helmet>
                <title>{'GDDL - ' + pack.Name}</title>
                <meta property='og:type' content='website' />
                <meta property='og:site_name' content='GD Demon Ladder' />
                <meta property='og:title' content={pack.Name} />
                <meta property='og:url' content={`https://gdladder.com/pack/${packID}`} />
                <meta property='og:description' content='The project to improve demon difficulties' />
            </Helmet>
            <div className='flex gap-2 mb-4'>
                <div>
                    {pack.IconName && <img src={'/packIcons/' + pack.IconName} style={{minWidth: '64px'}} />}
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
                        {pack.Levels.filter((lvl) => !lvl.EX).map((l) => (
                            <Level info={l} key={l.LevelID} />
                        ))}
                    </div>
                )
                : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 my-3 mb-8'>
                        {pack.Levels.filter((lvl) => !lvl.EX).map((l) => (
                            <GridLevel info={l} />
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
                                <Level info={l} key={l.LevelID} />
                            ))}
                        </div>
                    )
                    : (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 my-3 mb-8'>
                            {exLevels.map((l) => (
                                <GridLevel info={l} />
                            ))}
                        </div>
                    )
                }
            </>}
        </Container>
    );
}