import React from 'react';
import { useLoaderData } from 'react-router-dom';
import Creator from './Creator';
import DemonLogo from '../../../DemonLogo';

export async function levelLoader({ params }) {
    return fetch('http://localhost:8080/getLevel?levelID=' + params.level_id)
    .then((res) => res.json());
}

export default function LevelOverview() {
    const levelInfo = useLoaderData();

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

    return (
        <div className='container'>
            <h1>Level information for {level.Name}</h1>
            by <Creator name={level.Creator} />
            <div className='row table-container'>
                <div className='col-3'>
                    <DemonLogo diff={level.Difficulty} />
                </div>
                <div className='row col-9'>
                    <div className='row'>
                        <div className='col-4'>
                            <b>ID</b>
                            <p>{level.ID}</p>
                        </div>
                        <div className='col-4'>
                            <b>Song name</b>
                            <p>{level.Song}</p>
                        </div>
                        <div className='col-4'>
                            <b>Difficulty</b>
                            <p>{level.Difficulty + ' Demon'}</p>
                        </div>
                        <div className='col-4'>
                            <b>Tier</b>
                            <p>{level.Rating === -1 ? 'Unrated' : level.Rating} [{levelInfo.submissions.length}]</p>
                        </div>
                        <div className='col-4'>
                            <b>Enjoyment</b>
                            <p>{enjoyment + ' [WIP]'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}