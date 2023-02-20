import React from 'react';
import { Link } from 'react-router-dom';

export default function Submission({ info, approve, remove }) {
    return (
        <div className='bg-middle rounded-4 p-3 my-2'>
            <div className='mb-3'>
                <Link to={`/level/${info.LevelID}`} className='h3'>{info.LevelName}</Link>
                <span> submitted by </span>
                <Link to={`/user/${info.UserID}`} className='fw-bold'>{info.UserName}</Link>
            </div>
            <div>
                <p>{'Device: ' + info.Device}</p>
                <p>{'Refresh Rate: ' + info.RefreshRate}</p>
                <p>{'Rating: ' + info.Rating}</p>
                <p>{'Enjoyment: ' + info.Enjoyment}</p>
            </div>
            <div className='d-flex justify-content-evenly'>
                <button className='btn btn-primary px-3' onClick={() => approve(info)}>Approve</button>
                <button className='btn btn-danger px-3' onClick={() => remove(info)}>Delete</button>
            </div>
        </div>
    );
}