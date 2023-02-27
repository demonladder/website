import React from 'react';
import { useLoaderData } from 'react-router-dom';
import Creator from './Creator';
import DemonLogo from '../../../components/DemonLogo';
import serverIP from '../../../serverIP';
import Submission from './Submission';
import { Helmet } from 'react-helmet';
import PackRef from '../../../components/PackRef';
import { Accordion } from 'react-bootstrap';

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

    let avgRating = '-';
    let roundedRating = 'Unrated';
    let avgEnjoyment = '-';
    let roundedEnjoyment = 'Unrated';
    let standardDeviation = '-';
    if (ratings.length > 0) {
        avgRating = ratings.reduce((a, c) => a + c, 0) / ratings.length;  // reduce() calculates the sum
        standardDeviation = ratings.length > 1 ? Math.sqrt(ratings.reduce((a, c) => a + Math.pow(c-avgRating, 2), 0) / (ratings.length - 1)).toFixed(2) : 0;
        roundedRating = Math.round(avgRating);
        avgRating = avgRating.toFixed(2);
    }

    if (enjoyments.length > 0) {
        avgEnjoyment = (enjoyments.reduce((a, c) => a + c, 0) / enjoyments.length).toFixed(2);
        roundedEnjoyment = Math.round(avgEnjoyment);
    }
    
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
                <meta property="og:description" content={`Tier ${avgRating || '-'}, enjoyment ${avgEnjoyment || '-'}\nby ${level.Creator}`} />
                <meta property="og:image" content={logo} />
            </Helmet>
            <h1>Level information for {level.Name}</h1>
            by <Creator name={level.Creator} />
            <div className='row table-container mb-5'>
                <div className='col-lg-3 col-md-4 col-12'>
                    <img src={logo} width='100%' alt='' />
                </div>
                <div className='row col-lg-9 col-md-8 col-12'>
                    <div className='col-lg-4 col-md-6 col-6'>
                        <b className='d-block'>ID</b>
                        <button className='style-link p-0 fs-2' onClick={onIDClick}>{level.ID}</button>
                    </div>
                    <div className='col-lg-4 col-md-6 col-6'>
                        <b>Tier</b>
                        <p>{roundedRating} [{avgRating}]</p>
                    </div>
                    <div className='col-lg-4 col-md-6 col-6'>
                        <b>Enjoyment</b>
                        <p>{roundedEnjoyment} [{avgEnjoyment}]</p>
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
            <Accordion>
                <Accordion.Item eventKey='0'>
                    <Accordion.Header><h1>Submissions [{levelInfo.submissions.length}]</h1></Accordion.Header>
                    <Accordion.Body>
                        {levelInfo.submissions.map(s => <Submission submission={s} key={s.UserID} />)}
                        {levelInfo.submissions.length === 0 ? <p className='mb-0'>This level does not have any submissions</p> : null}
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey='1'>
                    <Accordion.Header><h1>Packs [{levelInfo.packs.length}]</h1></Accordion.Header>
                    <Accordion.Body>
                        {levelInfo.packs.map(p => <PackRef pack={p} key={p.ID} />)}
                        {levelInfo.packs.length === 0 ? <p className='mb-0'>This level is not part of any packs</p> : null}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
}