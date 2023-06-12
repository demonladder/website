import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DemonLogo from '../../../components/DemonLogo';
import Submission from './Submission';
import { Helmet } from 'react-helmet';
import PackRef from '../../../components/PackRef';
import { GetLevel } from '../../../api/levels';
import LoadingSpinner from '../../../components/LoadingSpinner';
import IDButton from '../../../components/IDButton';
import { ToFixed } from '../../../functions';

export default function LevelOverview() {
    const levelID = parseInt(''+useParams().levelID) || 0;
    const { status, data: levelInfo, failureReason } = useQuery({
        queryKey: ['level', levelID],
        queryFn: () => GetLevel(levelID),
    });

    if (status === 'loading'){
        return <LoadingSpinner />;
    } else if (status === 'error') {
        return (
            <div className='container'>
                <h1>{(failureReason as any).response.data || 'An error ocurred'}</h1>
            </div>
        )
    }

    const level = levelInfo.info;

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

    const packAmount = levelInfo.packs?.length || '0';

    return (
        <div className='container level-overview'>
            <Helmet>
                <title>{`GDDL - ${level.Name}`}</title>
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://gdladder.com/" />
                <meta property="og:title" content={level.Name} />
                <meta property="og:description" content={`Tier ${avgRating || '-'}, enjoyment ${avgEnjoyment || '-'}\nby ${level.Creator}`} />
                <meta property="og:image" content={logo} />
            </Helmet>
            <h1>Level information for {level.Name}</h1>
            <p>by {level.Creator}</p>
            <div className='row table-container mb-5'>
                <div className='col-12 col-md-4 col-lg-3'>
                    <img src={logo} width='100%' alt='' />
                </div>
                <div className='row col-12 col-md-8 col-lg-9'>
                    <div className='col-6 col-lg-4'>
                        <b className='d-block'>ID</b>
                        <IDButton id={level.ID} />
                    </div>
                    <div className='col-6 col-lg-4'>
                        <b>Tier</b>
                        <p>{roundedRating} [{avgRating}]</p>
                    </div>
                    <div className='col-6 col-lg-4'>
                        <b>Enjoyment</b>
                        <p>{roundedEnjoyment} [{avgEnjoyment}]</p>
                    </div>
                    <div className='col-6 col-md-12 col-lg-4'>
                        <b>Difficulty</b>
                        <p>{level.Difficulty + ' Demon'}</p>
                    </div>
                    <div className='col-12 col-lg-4'>
                        <b>Song name</b>
                        <p>{level.Song}</p>
                    </div>
                    <div className='col-12 col-md-6 col-lg-4'>
                        <b>Standard deviation</b>
                        <p>{standardDeviation}</p>
                    </div>
                </div>
            </div>
            <h2>Submissions</h2>
            <div className='submission-wrapper'>
                {levelInfo.submissions.map(s => <Submission submission={s} key={s.UserID} />)}
                {levelInfo.submissions.length === 0 ? <p className='mb-0'>This level does not have any submissions</p> : null}
            </div>
            <h2>Packs [{packAmount}]</h2>
            {levelInfo.packs?.map(p => <PackRef pack={p} key={p.ID} />)}
            {levelInfo.packs?.length === 0 ? <p className='mb-0'>This level is not part of any packs</p> : null}
        </div>
    );
}