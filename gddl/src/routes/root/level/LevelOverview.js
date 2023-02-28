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

    let avgRating = '-';
    let roundedRating = 'Unrated';
    let avgEnjoyment = '-';
    let roundedEnjoyment = 'Unrated';
    let standardDeviation = '-';

    if (level.RatingCount > 0) {
        avgRating = level.Rating.toFixed(2);
        roundedRating = Math.round(level.Rating);
        standardDeviation = level.Deviation.toFixed(2);
    }

    if (level.EnjoymentCount > 0) {
        avgEnjoyment = level.Enjoyment.toFixed(2);
        roundedEnjoyment = Math.round(avgEnjoyment);
    }
    
    const logo = DemonLogo(level.Difficulty);
    
    function onIDClick() {
        navigator.clipboard.writeText(level.ID);
    }

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
            by <Creator name={level.Creator} />
            <div className='row table-container mb-5'>
                <div className='col-12 col-md-4 col-lg-3'>
                    <img src={logo} width='100%' alt='' />
                </div>
                <div className='row col-12 col-md-8 col-lg-9'>
                    <div className='col-6 col-lg-4'>
                        <b className='d-block'>ID</b>
                        <button className='style-link p-0 fs-2' onClick={onIDClick}>{level.ID}</button>
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
            <Accordion>
                <Accordion.Item eventKey='0'>
                    <Accordion.Header><h1>Submissions [{level.SubmissionCount}]</h1></Accordion.Header>
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