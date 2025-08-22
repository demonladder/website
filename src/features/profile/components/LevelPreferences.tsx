import { useMutation, useQuery } from '@tanstack/react-query';
import Heading2 from '../../../components/headings/Heading2';
import { getFavoriteLevels, GetFavoriteLevelsResponse, getLeastFavoriteLevels } from '../api/getFavoriteLevels';
import Level, { LevelSkeleton } from '../../../components/Level';
import { useParams } from 'react-router';
import useContextMenu from '../../../components/ui/menuContext/useContextMenu';
import APIClient from '../../../api/APIClient';
import useSession from '../../../hooks/useSession';
import { toast } from 'react-toastify';
import useAddListLevelModal from '../../../hooks/modals/useAddListLevelModal';

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

    if (data && data.length === 0) return;

    return (
        <section className='mt-6'>
            <Heading2>Favorite levels</Heading2>
            {status === 'pending' && <LevelSkeleton />}
            {status === 'success' &&
                data.map((level) => <FavoriteLevel level={level} userID={userID} isFavorite={true} key={level.ID} />)
            }
        </section>
    );
}

function LeastFavoriteLevels({ userID }: { userID: number }) {
    const { data, status } = useQuery({
        queryKey: ['user', userID, 'least-favorites'],
        queryFn: () => getLeastFavoriteLevels(userID),
    });

    if (data && data.length === 0) return;

    return (
        <section className='mt-6'>
            <Heading2>Least favorite levels</Heading2>
            {status === 'pending' && <LevelSkeleton />}
            {status === 'success' &&
                data.map((level) => <FavoriteLevel level={level} userID={userID} isFavorite={false} key={level.ID} />)
            }
        </section>
    );
}

function FavoriteLevel({ level, userID, isFavorite }: { level: GetFavoriteLevelsResponse, userID: number, isFavorite: boolean }) {
    const session = useSession();
    const deleteMutation = useMutation({
        mutationFn: () => APIClient.delete(`/user/${session.user?.ID}/${isFavorite ? 'favorites' : 'least-favorites'}`, { data: { levelID: level.ID } }),
        onSuccess: () => toast.success('Removed level'),
    });
    const openAddListLevelModal = useAddListLevelModal();

    const onContextMenu = useContextMenu([
        { text: 'Go to level', to: `/level/${level.ID}` },
        { text: 'Add to list', onClick: () => openAddListLevelModal(session.user!.ID, level.ID), requireSession: true },
        { type: 'divider', userID },
        { type: 'danger', text: 'Remove', onClick: () => deleteMutation.mutate(), userID },
    ]);

    return (
        <Level onContextMenu={onContextMenu} ID={level.ID} rating={level.Rating} enjoyment={level.Enjoyment} name={level.Meta.Name} creator={level.Meta.Publisher?.name} difficulty={level.Meta.Difficulty} rarity={level.Meta.Rarity} />
    );
}
