import { useQuery } from '@tanstack/react-query';
import { PrimaryButton } from '../../../components/Button';
import Container from '../../../components/Container';
import GetCompareLevels from '../../../api/level/GetCompareLevels';

function Level({ name, creator, rating, enjoyment }: { name: string, creator: string, rating: number | null, enjoyment: number | null }) {
    const roundedRating = rating !== null ? rating.toFixed() : '-';
    const roundedEnjoyment = enjoyment !== null ? enjoyment.toFixed() : '-';

    return (<>
        <h2 className='text-2xl'>{name}</h2>
        <p>by {creator}</p>
        <p className={`tier-${roundedRating}`}>{rating?.toFixed(2)}</p>
        <p className={`tier-${roundedEnjoyment}`}>{enjoyment?.toFixed(2)}</p>
        <PrimaryButton>Vote</PrimaryButton>
    </>);
}

export default function Compare() {
    const { data } = useQuery({
        queryKey: ['randomLevels'],
        queryFn: GetCompareLevels,
    });

    return (
        <Container>
            <h1 className='text-4xl'>Compare</h1>
            <p>Vote on the better level</p>
            <div className='flex text-center'>
                <div className='w-5/12'>
                    {data?.levels[0] && <Level name={data?.levels[0].Meta.Name} creator={data?.levels[0].Meta.Creator} rating={data?.levels[0].Rating} enjoyment={data?.levels[0].Enjoyment} />}
                </div>
                <p className='w-2/12 self-center'>vs</p>
                <div className='w-5/12'>
                    {data?.levels[1] && <Level name={data?.levels[1].Meta.Name} creator={data?.levels[1].Meta.Creator} rating={data?.levels[1].Rating} enjoyment={data?.levels[1].Enjoyment} />}
                </div>
            </div>
        </Container>
    );
}