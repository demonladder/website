import React from 'react';
import { useLoaderData } from 'react-router-dom';
import Creator from './Creator';
import parseDiff from '../../parseDiff';
import './LevelOverview.css';

export async function levelLoader({ params }) {
    return fetch('http://localhost:8080/level?id=' + params.level_id)
    .then((res) => res.json());
}

export default function LevelOverview() {
    const level = useLoaderData();

    return (
        <div>
            <h1>Level information for {level.name}</h1>
            by <Creator name={level.creator} />
            <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Tier</td>
                            <td>Official Difficulty</td>
                            <td>Song name</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{level.id}</td>
                            <td>{level.rating}</td>
                            <td>{parseDiff(level.officialDifficulty)}</td>
                            <td>{level.song}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}