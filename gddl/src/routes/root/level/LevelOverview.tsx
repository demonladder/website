import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DemonLogo from '../../../components/DemonLogo';
import { Helmet } from 'react-helmet';
import { GetLevel } from '../../../api/levels';
import LoadingSpinner from '../../../components/LoadingSpinner';
import IDButton from '../../../components/IDButton';
import { ToFixed } from '../../../functions';
import Packs from './Packs';
import Submissions from './Submissions';
import Container from '../../../components/Container';

export default function LevelOverview() {
    const levelID = parseInt(''+useParams().levelID) || 0;
    const { status, data: level, error } = useQuery({
        queryKey: ['level', levelID],
        queryFn: () => GetLevel(levelID),
    });

    if (status === 'loading'){
        return <LoadingSpinner />;
    } else if (status === 'error') {
        console.log(error);
        return (
            <div className='container'>
                <h1>An error ocurred</h1>
            </div>
        )
    }

    console.log(level);
    
    if (level === null) return null;

    let avgRating = '-';
    let roundedRating = 'Unrated';
    let avgEnjoyment = '-';
    let roundedEnjoyment = 'Unrated';
    let standardDeviation = '-';

    if (level.RatingCount > 0) {
        avgRating = level.Rating.toFixed(2);
        roundedRating = ''+Math.round(level.Rating);
        standardDeviation = ''+ToFixed(''+level.Deviation, 2, '0');
    }

    if (level.EnjoymentCount > 0) {
        avgEnjoyment = level.Enjoyment.toFixed(2);
        roundedEnjoyment = ''+Math.round(parseFloat(avgEnjoyment));
    }
    
    const logo = DemonLogo(level.Difficulty);

    return (
        <Container className='bg-gray-800'>
            <Helmet>
                <title>{`GDDL - ${level.Name}`}</title>
                <meta property='og:type' content='website' />
                <meta property='og:url' content='https://gdladder.com/' />
                <meta property='og:title' content={level.Name} />
                <meta property='og:description' content={`Tier ${avgRating || '-'}, enjoyment ${avgEnjoyment || '-'}\nby ${level.Creator}`} />
                <meta property='og:image' content={logo} />
            </Helmet>
            <div className='mb-1'>
                <h1 className='text-5xl'>{level.Name}</h1>
                <p className='text-3xl'>by {level.Creator}</p>
            </div>
            <div className='grid grid-cols-12 gap-4 p-4 bg-gray-700 text-2xl'>
                <div className='col-span-12 md:col-span-4 lg:col-span-2'>
                    <img src={logo} width='100%' alt='' />
                </div>
                <div className='col-span-12 md:col-span-8 lg:col-span-10 grid grid-cols-12 gap-2'>
                    <div className='col-span-6 lg:col-span-2'>
                        <b className='block'>ID</b>
                        <IDButton id={level.ID} />
                    </div>
                    <div className='col-span-6 lg:col-span-2'>
                        <b>Tier</b>
                        <p>{roundedRating} [{avgRating}]</p>
                    </div>
                    <div className='col-span-6 lg:col-span-2'>
                        <b>Enjoyment</b>
                        <p>{roundedEnjoyment} [{avgEnjoyment}]</p>
                    </div>
                    <div className='col-span-12 md:col-span-6 lg:col-span-3'>
                        <b>Standard deviation</b>
                        <p>{standardDeviation}</p>
                    </div>
                    <div className='col-span-12 lg:col-span-4'>
                        <b>Difficulty</b>
                        <p>{level.Difficulty + ' Demon'}</p>
                    </div>
                    <div className='col-span-12 lg:col-span-4'>
                        <b>Song name</b>
                        <p>{level.Song}</p>
                    </div>
                    <div className='col-span-6'>
                        <b>Ratings</b>
                        <p>{level.RatingCount}</p>
                    </div>
                    <div className='col-span-6'>
                        <b>Enjoyments</b>
                        <p>{level.EnjoymentCount}</p>
                    </div>
                </div>
            </div>
            <Submissions levelID={levelID} />
            <Packs levelID={levelID} />
        </Container>
    );
}