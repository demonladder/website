import { useQuery } from '@tanstack/react-query';
import Heading2 from '../../../components/headings/Heading2';
import { getFavoriteLevels, GetFavoriteLevelsResponse, getLeastFavoriteLevels } from '../api/getFavoriteLevels';
import Level, { LevelSkeleton } from '../../../components/Level';
import { useParams } from 'react-router-dom';

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
                data.map((level) => <FavoriteLevel level={level} key={level.ID} />)
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
                data.map((level) => <FavoriteLevel level={level} key={level.ID} />)
            }
        </section>
    );
}

function FavoriteLevel({ level }: { level: GetFavoriteLevelsResponse }) {
    return (
        <Level ID={level.ID} rating={level.Rating} enjoyment={level.Enjoyment} name={level.Meta.Name} creator={level.Meta.Creator} difficulty={level.Meta.Difficulty} rarity={level.Meta.Rarity} />
    );
}
