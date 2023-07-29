import { useState } from 'react';
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
import SubmitModal from '../../../components/SubmitModal';

export default function LevelOverview() {
    const [showModal, setShowModal] = useState(false);

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
    
    if (level === null) return null;

    let avgRating = '-';
    let roundedRating = 'Unrated';
    let avgEnjoyment = '-';
    let roundedEnjoyment = 'Unrated';
    let standardDeviation = '-';

    if (level.RatingCount > 0 && level.Rating !== null) {
        avgRating = level.Rating.toFixed(2);
        roundedRating = ''+Math.round(level.Rating);
        standardDeviation = ''+ToFixed(''+level.Deviation, 2, '0');
    }

    if (level.EnjoymentCount > 0 && level.Enjoyment !== null) {
        avgEnjoyment = level.Enjoyment.toFixed(2);
        roundedEnjoyment = ''+Math.round(parseFloat(avgEnjoyment));
    }
    
    const logo = DemonLogo(level.Difficulty);

    return (
        <>
            <Container>
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
                <div className='grid grid-cols-12 gap-4 p-4 bg-gray-700 round:rounded-xl text-xl'>
                    <div className='col-span-12 md:col-span-4 lg:col-span-2'>
                        <img src={logo} width='100%' alt='' />
                    </div>
                    <div className='col-span-12 md:col-span-8 lg:col-span-10 grid grid-cols-12 gap-3'>
                        <div className='col-span-6 lg:col-span-3 xl:col-span-2 bg-gray-500 round:rounded-md p-2'>
                            <b className='block'>ID</b>
                            <IDButton className='text-2xl' id={level.LevelID} />
                        </div>
                        <div className='col-span-6 lg:col-span-3 xl:col-span-2 bg-gray-500 round:rounded-md p-2'>
                            <b>Tier</b>
                            <p className='text-2xl'>{roundedRating} [{avgRating}]</p>
                        </div>
                        <div className='col-span-12 sm:col-span-5 lg:col-span-3 xl:col-span-2 bg-gray-500 round:rounded-md p-2'>
                            <b>Enjoyment</b>
                            <p className='text-2xl'>{roundedEnjoyment} [{avgEnjoyment}]</p>
                        </div>
                        <div className='col-span-12 sm:col-span-7 lg:col-span-3 bg-gray-500 round:rounded-md p-2 cursor-help' title='The standard deviation of ratings. The higher the value, the more diverse the ratings.'>
                            <b>Deviation</b>
                            <p className='text-2xl'>{standardDeviation}</p>
                        </div>
                        <div className='col-span-12 lg:col-span-3 bg-gray-500 round:rounded-md p-2'>
                            <b>Difficulty</b>
                            <p className='text-2xl'>{level.Difficulty + ' Demon'}</p>
                        </div>
                        <div className='col-span-12 lg:col-span-9 xl:col-span-8 bg-gray-500 round:rounded-md p-2'>
                            <b>Song name</b>
                            <p className='text-2xl'>{level.Song}</p>
                        </div>
                        <div className='col-span-6 xl:col-span-2 bg-gray-500 round:rounded-md p-2'>
                            <b>Ratings</b>
                            <p className='text-2xl'>{level.RatingCount}</p>
                        </div>
                        <div className='col-span-6 xl:col-span-2 bg-gray-500 round:rounded-md p-2'>
                            <b>Enjoyments</b>
                            <p className='text-2xl'>{level.EnjoymentCount}</p>
                        </div>
                    </div>
                </div>
                <Submissions levelID={levelID} />
                <Packs levelID={levelID} />
            </Container>
            <SubmitModal show={showModal} onClose={() => setShowModal(false)} initialLevel={level} id='levelSubmit' />
        </>
    );
}