import React from 'react';
import { Link } from 'react-router-dom';
import { SubmissionQueueInfo } from '../../../api/submissions';

type Props = {
    info: SubmissionQueueInfo,
    approve: (submission: SubmissionQueueInfo) => void,
    remove: (submission: SubmissionQueueInfo) => void,
}

export default function Submission({ info, approve, remove }: Props) {
    return (
        <div className={`tier-${Math.round(info.ActualRating) || -1} p-3 my-2`}>
            <div className='mb-3'>
                <Link to={`/level/${info.LevelID}`} className='h3 underline'>{info.Name}</Link>
                <span> submitted by </span>
                <a href={`/profile/${info.UserID}`} className='underline fw-bold' target='_blank' rel='noopener noreferrer'>{info.UserName}</a>
            </div>
            <div>
                <p>{'Device: ' + info.Device}</p>
                <p>{'Refresh Rate: ' + info.RefreshRate}</p>
                <p>{'Rating: ' + (info.Rating === 0 ? 'None' : info.Rating)}</p>
                <p>{'Enjoyment: ' + (info.Enjoyment === -1 ? 'None' : info.Enjoyment)}</p>
                <p>Proof: {info.Proof ? <a href={info.Proof} target='_blank' rel='noopener noreferrer'>{info.Proof}</a> : 'None'}</p>
            </div>
            <div className='d-flex justify-content-evenly'>
                <button className='btn btn-primary px-3' onClick={() => approve(info)}>Approve</button>
                <button className='btn btn-danger px-3' onClick={() => remove(info)}>Delete</button>
            </div>
        </div>
    );
}