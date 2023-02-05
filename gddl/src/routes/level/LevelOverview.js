import React from 'react';
import { useLoaderData } from 'react-router-dom';
import Creator from './Creator';
import parseDiff from '../../parseDiff';
import './LevelOverview.css';
import DemonLogo from '../../DemonLogo';

export async function levelLoader({ params }) {
    return fetch('http://localhost:8080/level?id=' + params.level_id)
    .then((res) => res.json());
}

export default function LevelOverview() {
    const levelInfo = useLoaderData();

    const level = levelInfo.levelData;

    let enjoyment = 'Unrated';
    if (levelInfo.enjoyments.length !== 0) {
        enjoyment = 0;
        levelInfo.enjoyments.forEach((e) => {
            enjoyment += e.enjoyment;
        });
        enjoyment /= levelInfo.enjoyments.length;
    }

    return (
        <>
            <h1>Level information for {level.name}</h1>
            by <Creator name={level.creator} />
            <div className='row table-container'>
                <div className='col-3'>
                    <DemonLogo diff={level.officialDifficulty} />
                </div>
                <div className='row col-9'>
                    <div className='row'>
                        <div className='col-4'>
                            <b>ID</b>
                            <p>{level.id}</p>
                        </div>
                        <div className='col-4'>
                            <b>Song name</b>
                            <p>{level.song}</p>
                        </div>
                        <div className='col-4'>
                            <b>Difficulty</b>
                            <p>{parseDiff(level.officialDifficulty)}</p>
                        </div>
                        <div className='col-4'>
                            <b>Tier</b>
                            <p>{level.rating === -1 ? 'Unrated' : level.rating} [{levelInfo.ratings.length}]</p>
                        </div>
                        <div className='col-4'>
                            <b>Enjoyment</b>
                            <p>{enjoyment}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}