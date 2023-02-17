import React from 'react';
import { useLoaderData } from 'react-router-dom';
import Creator from './Creator';
import DemonLogo from '../../../DemonLogo';
import serverIP from '../../../serverIP';
import Submission from './Submission';

export async function levelLoader({ params }) {
    return fetch(serverIP + '/getLevel?levelID=' + params.level_id)
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
    let enjoyments = levelInfo.submissions.filter(e => e.enjoyment != null);

    let enjoyment = 'Unrated';
    if (enjoyments.length !== 0) {
        enjoyment = 0;
        enjoyments.forEach((e) => {
            enjoyment += e.enjoyment;
        });
        enjoyment /= enjoyments.length;
    }

    const ratings = levelInfo.submissions.filter(e => e.Rating != null).map(s => s.Rating);
    const average = ratings.reduce((a, c) => a + c, 0) / ratings.length;  // reduce() calculates the sum
    const standardDeviation = Math.sqrt(ratings.reduce((a, c) => a + Math.pow(c-average, 2), 0) / ratings.length).toFixed(2);

    return (
        <div className='container'>
            <h1>Level information for {level.Name}</h1>
            by <Creator name={level.Creator} />
            <div className='row table-container'>
                <div className='col-lg-3 col-md-4 col-12'>
                    <img src={DemonLogo(level.Difficulty)} width='100%' alt='' />
                </div>
                <div className='row col-lg-9 col-md-8 col-12'>
                    <div className='col-lg-4 col-md-6 col-12'>
                        <b>ID</b>
                        <p>{level.ID}</p>
                    </div>
                    <div className='col-lg-4 col-md-6 col-12'>
                        <b>Tier</b>
                        <p>{level.Rating === -1 ? 'Unrated' : level.Rating} [{levelInfo.submissions.length}]</p>
                    </div>
                    <div className='col-lg-4 col-md-12 col-12'>
                        <b>Song name</b>
                        <p>{level.Song}</p>
                    </div>
                    <div className='col-lg-4 col-md-6 col-12'>
                        <b>Difficulty</b>
                        <p>{level.Difficulty + ' Demon'}</p>
                    </div>
                    <div className='col-lg-4 col-md-6 col-12'>
                        <b>Enjoyment</b>
                        <p>{enjoyment + ' [WIP]'}</p>
                    </div>
                    <div className='col-lg-4 col-md-6 col-12'>
                        <b>Standard deviation</b>
                        <p>{standardDeviation}</p>
                    </div>
                </div>
            </div>
            <div className='mt-4'>
                <h1>Submissions</h1>
                {levelInfo.submissions.map(s => <Submission submission={s} key={s.UserID} />)}
            </div>
        </div>
    );
}