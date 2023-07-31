import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { StorageManager } from '../../../storageManager';

export default function LevelOverview() {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const levelID = parseInt(''+useParams().levelID) || 0;
    const { status, data: level } = useQuery({
        queryKey: ['level', levelID],
        queryFn: () => GetLevel(levelID),
    });

    if (status === 'loading'){
        return <Container><LoadingSpinner /></Container>;
    } else if (status === 'error') {
        return (
            <Container>
                <h1 className='text-4xl'>An error ocurred</h1>
            </Container>
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

    function creatorClicked() {
        const stored = JSON.parse(sessionStorage.getItem('search.filters') || '{}');
        sessionStorage.setItem('search.filters', JSON.stringify({ ...stored, creator: level?.Creator || '' }));
        navigate('/list');
    }
    
    const logo = DemonLogo(level.Difficulty);

    return (
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
                <h1 className='text-4xl font-bold'>{level.Name} <button onClick={() => setShowModal(true)} hidden={!StorageManager.hasSession()}><i className='bx bx-list-plus'></i></button></h1>
                <p className='text-2xl'>by <span className='cursor-pointer' onClick={creatorClicked}>{level.Creator}</span></p>
            </div>
            <div className='grid grid-cols-12 gap-4 p-4 bg-gray-700 round:rounded-xl text-xl'>
                <div className='col-span-12 md:col-span-4 lg:col-span-2'>
                    <img src={logo} width='100%' alt='' />
                </div>
                <div className='col-span-12 md:col-span-8 lg:col-span-10 grid grid-cols-12 gap-3'>
                    <div className='col-span-6 lg:col-span-3 xl:col-span-2 bg-gray-500 round:rounded-lg p-2 flex flex-col justify-center'>
                        <b className='block'>ID</b>
                        <div>
                            <IDButton className='text-2xl text-left' id={level.LevelID} />
                        </div>
                    </div>
                    <div className='col-span-6 lg:col-span-3 xl:col-span-2 bg-gray-500 round:rounded-lg p-2 flex flex-col justify-center'>
                        <b>Tier</b>
                        <p className='text-2xl'>{roundedRating} [{avgRating}]</p>
                    </div>
                    <div className='col-span-12 sm:col-span-5 lg:col-span-3 xl:col-span-2 bg-gray-500 round:rounded-lg p-2 flex flex-col justify-center'>
                        <b>Enjoyment</b>
                        <p className='text-2xl'>{roundedEnjoyment} [{avgEnjoyment}]</p>
                    </div>
                    <div className='col-span-12 sm:col-span-7 lg:col-span-3 bg-gray-500 round:rounded-lg p-2 flex flex-col justify-center cursor-help' title='The standard deviation of ratings. The higher the value, the more diverse the ratings.'>
                        <b>Deviation</b>
                        <p className='text-2xl'>{standardDeviation}</p>
                    </div>
                    <div className='col-span-12 lg:col-span-3 bg-gray-500 round:rounded-lg p-2 flex flex-col justify-center'>
                        <b>Difficulty</b>
                        <p className='text-2xl'>{level.Difficulty + ' Demon'}</p>
                    </div>
                    <div className='col-span-12 lg:col-span-9 xl:col-span-8 bg-gray-500 round:rounded-lg p-2 flex flex-col justify-center'>
                        <b>Song name</b>
                        <p className='text-2xl break-all'>{level.Song}</p>
                    </div>
                    <div className='col-span-12 sm:col-span-6 xl:col-span-2 bg-gray-500 round:rounded-lg p-2 flex flex-col justify-center'>
                        <b>Ratings</b>
                        <p className='text-2xl'>{level.RatingCount}</p>
                    </div>
                    <div className='col-span-12 sm:col-span-6 xl:col-span-2 bg-gray-500 round:rounded-lg p-2 flex flex-col justify-center'>
                        <b>Enjoyments</b>
                        <p className='text-2xl'>{level.EnjoymentCount}</p>
                    </div>
                </div>
            </div>
            <Submissions levelID={levelID} />
            <Packs levelID={levelID} />
            <SubmitModal show={showModal} onClose={() => setShowModal(false)} level={level} />
        </Container>
    );
}