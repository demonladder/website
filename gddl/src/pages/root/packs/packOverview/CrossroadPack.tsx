import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { GetSinglePack } from '../../../../api/pack/requests/GetSinglePack';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import Container from '../../../../components/Container';
import Level from '../../../../components/Level';
import useLevelView from '../../../../hooks/useLevelView';
import { GridLevel } from '../../../../components/GridLevel';

export default function CrossroadPack() {
    const { status, data: pack } = useQuery({
        queryKey: ['packs', 78],
        queryFn: () => GetSinglePack(78),
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

    const allTypes = pack.Levels.map((l) => l.Path).filter((t) => t !== undefined) as string[];
    const types = allTypes.filter((t, i) => allTypes.indexOf(t) === i);
    
    return (
        <Container className='bg-gray-800'>
            <Helmet>
                <title>{'GDDL - ' + pack.Name}</title>
                <meta property='og:type' content='website' />
                <meta property='og:site_name' content='GD Demon Ladder' />
                <meta property='og:title' content={pack.Name} />
                <meta property='og:url' content={`https://gdladder.com/pack/${78}`} />
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
            {types.map((t) => (
                    <div className='mt-2'>
                        <h3 className='text-xl'>{t} path</h3>
                        {isList
                            ? (<div className='level-list mb-8'>
                                <Level.Header />
                                {pack.Levels.filter((lvl) => lvl.Path === t).sort((a, b) => (a.Rating || 0) - (b.Rating || 0)).map((l) => (
                                    <Level info={l} key={l.LevelID} />
                                ))}
                            </div>)
                            : (<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 my-3 mb-8'>
                                {pack.Levels.filter((lvl) => lvl.Path === t).sort((a, b) => (a.Rating || 0) - (b.Rating || 0)).map((l) => (
                                    <GridLevel info={l} />
                                ))}
                            </div>)
                        }
                        
                    </div>
                ))
            }
        </Container>
    );
}