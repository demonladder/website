import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import Creator from './Creator';
import DemonLogo from '../../../DemonLogo';
import serverIP from '../../../serverIP';
import Submission from './Submission';
import { Helmet } from 'react-helmet';

export async function levelLoader({ params }) {
    return fetch(`${serverIP}/getLevel?levelID=${params.level_id}&returnPacks=true`)
    .then((res) => res.json())
    .catch(e => { return { error: true, message: 'Couldn\'t connect to the server!' }});
}

export default function LevelOverview() {
    const levelInfo = useLoaderData();

    if (levelInfo.error) {
        return (
            <div className='container'>
                <h1>{levelInfo.message}</h1>
            </div>
        )
    }

    const level = levelInfo.info;
    const enjoyments = levelInfo.submissions.filter(e => e.Enjoyment != null).map(s => s.Enjoyment);
    const ratings = levelInfo.submissions.filter(e => e.Rating != null).map(s => s.Rating);

    const avgEnjoyment = (enjoyments.reduce((a, c) => a + c, 0) / enjoyments.length).toFixed(2);
    const avgRating = ratings.reduce((a, c) => a + c, 0) / ratings.length;  // reduce() calculates the sum
    const standardDeviation = Math.sqrt(ratings.reduce((a, c) => a + Math.pow(c-avgRating, 2), 0) / ratings.length).toFixed(2);

    const logo = DemonLogo(level.Difficulty);
    
    function onIDClick() {
        navigator.clipboard.writeText(level.ID);
    }

    return (
        <div className='container'>
            <Helmet>
                <title>{`GDDL - ${level.Name}`}</title>
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://gdladder.com/" />
                <meta property="og:title" content={level.Name} />
                <meta property="og:description" content={`Tier ${avgRating.toFixed(2) || '-'}, enjoyment ${avgEnjoyment || '-'}\nby ${level.Creator}`} />
                <meta property="og:image" content={logo} />
            </Helmet>
            <h1>Level information for {level.Name}</h1>
            by <Creator name={level.Creator} />
            <div className='row table-container'>
                <div className='col-lg-3 col-md-4 col-12'>
                    <img src={logo} width='100%' alt='' />
                </div>
                <div className='row col-lg-9 col-md-8 col-12'>
                    <div className='col-lg-4 col-md-6 col-6'>
                        <b className='d-block'>ID</b>
                        <button className='style-link p-0' onClick={onIDClick}>{level.ID}</button>
                    </div>
                    <div className='col-lg-4 col-md-6 col-6'>
                        <b>Tier</b>
                        <p>{avgRating ? avgRating.toFixed(2) : 'Unrated'} [{ratings.length}]</p>
                    </div>
                    <div className='col-lg-4 col-md-6 col-6'>
                        <b>Enjoyment</b>
                        <p>{avgEnjoyment || 'Unrated'} [{enjoyments.length}]</p>
                    </div>
                    <div className='col-lg-4 col-md-12 col-6'>
                        <b>Difficulty</b>
                        <p>{level.Difficulty + ' Demon'}</p>
                    </div>
                    <div className='col-lg-4 col-md-12 col-12'>
                        <b>Song name</b>
                        <p>{level.Song}</p>
                    </div>
                    <div className='col-lg-4 col-md-6 col-12'>
                        <b>Standard deviation</b>
                        <p>{standardDeviation}</p>
                    </div>
                </div>
            </div>
            <div className='row mt-4'>
                <div className='col-6'>
                    <h1>Submissions</h1>
                    {levelInfo.submissions.map(s => <Submission submission={s} key={s.UserID} />)}
                </div>
                <div className='col-6'>
                    <h1>Packs</h1>
                    {levelInfo.packs.map(p => <Link to={`/pack/${p.ID}`} className='d-block' key={p.ID}>{p.Name}</Link>)}
                </div>
            </div>
        </div>
    );
}