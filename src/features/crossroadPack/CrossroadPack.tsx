import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Level from '../../components/shared/Level';
import { GridLevel } from '../../components/shared/GridLevel';
import GetCrossroadsPackLevels from '../../api/pack/requests/GetCrossroadsPackLevels';
import Page from '../../components/layout/Page';
import { LevelRenderer } from '../../components/layout/LevelRenderer';
import usePack from '../singlePack/hooks/usePack';
import Heading1 from '../../components/headings/Heading1';
import { useApp } from '../../context/app/useApp';
import { LevelViewType } from '../../context/app/AppContext';

export default function CrossroadPack() {
    const { status, data: pack } = usePack(78);
    const { status: levelStatus, data: packLevels } = useQuery({
        queryKey: ['packs', 78, 'levels'],
        queryFn: GetCrossroadsPackLevels,
    });
    const app = useApp();

    if (status === 'pending' || levelStatus === 'pending') return <Page><LoadingSpinner /></Page>;
    if (status === 'error' || levelStatus === 'error') return <Page><Heading1>An error occurred</Heading1></Page>;

    const allTypes = packLevels.map((l) => l.Path).filter((t) => t !== undefined);
    const types = allTypes.filter((t, i) => allTypes.indexOf(t) === i);

    const levels = packLevels.sort((a, b) => (a.Rating ?? 0) - (b.Rating ?? 0));

    return (
        <Page>
            <title>{'GDDL - ' + pack.Name}</title>
            <meta property='og:type' content='website' />
            <meta property='og:site_name' content='GD Demon Ladder' />
            <meta property='og:title' content={pack.Name} />
            <meta property='og:url' content='https://gdladder.com/pack/78' />
            <meta property='og:description' content='The project to improve demon difficulties' />
            <div className='flex gap-2 mb-4'>
                <div>
                    {pack.IconName && <img src={'/packIcons/' + pack.IconName} style={{ minWidth: '64px' }} />}
                </div>
                <div>
                    <Heading1 className='mb-1'>{pack.Name}</Heading1>
                    <p>{pack.Description}</p>
                </div>
            </div>
            {types.map((type) => (
                <div className='mt-2' key={type}>
                    <h3 className='text-3xl'>{type} path</h3>
                    {app.levelViewType === LevelViewType.LIST
                        ? <LevelRenderer element={Level} levels={levels.filter((level) => level.Path === type)} className='level-list mb-8' />
                        : <LevelRenderer element={GridLevel} levels={levels.filter((level) => level.Path === type)} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 my-3 mb-8' />
                    }
                </div>
            ))
            }
        </Page>
    );
}
