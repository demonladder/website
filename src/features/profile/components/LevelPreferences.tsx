import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Heading2 from '../../../components/headings/Heading2';
import { getFavoriteLevels, GetFavoriteLevelsResponse, getLeastFavoriteLevels } from '../api/getFavoriteLevels';
import Level, { LevelSkeleton } from '../../../components/Level';
import { useParams } from 'react-router';
import useContextMenu from '../../../components/ui/menuContext/useContextMenu';
import APIClient from '../../../api/APIClient';
import useSession from '../../../hooks/useSession';
import { toast } from 'react-toastify';
import useAddListLevelModal from '../../../hooks/modals/useAddListLevelModal';
import { GridLevel } from '../../../components/GridLevel';
import { useApp } from '../../../context/app/useApp';
import { LevelViewType } from '../../../context/app/AppContext';
import type { AxiosError } from 'axios';
import renderToastError from '../../../utils/renderToastError';

export default function LevelPreferences() {
    const userID = useParams().userID;

    if (!userID || isNaN(parseInt(userID))) return;

    return (
        <>
            <FavoriteLevels userID={parseInt(userID)} />
            <LeastFavoriteLevels userID={parseInt(userID)} />
        </>
    );
}

function FavoriteLevels({ userID }: { userID: number }) {
    const { data, status } = useQuery({
        queryKey: ['user', userID, 'favorites'],
        queryFn: () => getFavoriteLevels(userID),
    });
    const app = useApp();

    if (data && data.length === 0) return;

    return (
        <section className='mt-6'>
            <Heading2>Favorite levels</Heading2>
            {status === 'pending' && <LevelSkeleton />}
            {status === 'success' && (
                app.levelViewType === LevelViewType.LIST
                    ? data.map((level) => <FavoriteLevel level={level} userID={userID} isFavorite={true} key={level.ID} />)
                    : <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
                        {data.map((level) => <FavoriteLevel level={level} userID={userID} isFavorite={true} key={level.ID} />)}
                    </div>
            )}
        </section>
    );
}

function LeastFavoriteLevels({ userID }: { userID: number }) {
    const { data, status } = useQuery({
        queryKey: ['user', userID, 'least-favorites'],
        queryFn: () => getLeastFavoriteLevels(userID),
    });
    const app = useApp();

    if (data && data.length === 0) return;

    return (
        <section className='mt-6'>
            <Heading2>Least favorite levels</Heading2>
            {status === 'pending' && <LevelSkeleton />}
            {status === 'success' && (
                app.levelViewType === LevelViewType.LIST
                    ? data.map((level) => <FavoriteLevel level={level} userID={userID} isFavorite={false} key={level.ID} />)
                    : <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
                        {data.map((level) => <FavoriteLevel level={level} userID={userID} isFavorite={false} key={level.ID} />)}
                    </div>
            )}
        </section>
    );
}

function FavoriteLevel({ level, userID, isFavorite }: { level: GetFavoriteLevelsResponse, userID: number, isFavorite: boolean }) {
    const session = useSession();
    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: (levelID: number) => APIClient.delete(`/user/${session.user?.ID}/${isFavorite ? 'favorites' : 'least-favorites'}`, { data: { levelID } }),
        onSuccess: (_, levelID) => {
            toast.success('Removed level');
            const queryKey = ['user', userID, isFavorite ? 'favorites' : 'least-favorites'];
            const cache = queryClient.getQueryData<{ ID: number }[]>(queryKey);
            if (!cache) return;
            queryClient.setQueryData(queryKey, cache.filter((level) => level.ID !== levelID));
        },
        onError: (error: AxiosError) => toast.error(renderToastError.render({ data: error })),
    });
    const openAddListLevelModal = useAddListLevelModal();

    const onContextMenu = useContextMenu([
        { text: 'Go to level', to: `/level/${level.ID}` },
        { text: 'Add to list', onClick: () => openAddListLevelModal(session.user!.ID, level.ID), requireSession: true },
        { type: 'divider', userID },
        { type: 'danger', text: 'Remove', onClick: () => deleteMutation.mutate(level.ID), userID },
    ]);

    const app = useApp();

    if (app.levelViewType === LevelViewType.LIST) return (
        <Level onContextMenu={onContextMenu} ID={level.ID} rating={level.Rating} enjoyment={level.Enjoyment} name={level.Meta.Name} creator={level.Meta.Publisher?.name} difficulty={level.Meta.Difficulty} rarity={level.Meta.Rarity} />
    );

    return (
        <GridLevel onContextMenu={onContextMenu} ID={level.ID} rating={level.Rating} enjoyment={level.Enjoyment} name={level.Meta.Name} creator={level.Meta.Publisher?.name} difficulty={level.Meta.Difficulty} rarity={level.Meta.Rarity} />
    );
}
