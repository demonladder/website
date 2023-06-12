import React from 'react';
import { Link } from 'react-router-dom';
import { SubmissionQueueInfo } from '../../../api/submissions';
import { useQuery } from '@tanstack/react-query';
import { GetLevel } from '../../../api/levels';

type Props = {
    info: SubmissionQueueInfo,
    approve: (submission: SubmissionQueueInfo) => void,
    remove: (submission: SubmissionQueueInfo) => void,
}

export default function Submission({ info, approve, remove }: Props) {
    const { data: levelData } = useQuery({
        queryKey: ['levels', info.LevelID],
        queryFn: () => GetLevel(info.LevelID),
    });

    return (
        <div className={`tier-${Math.round(info.ActualRating) || 0} p-3 my-2`}>
            <div className='mb-3'>
                <Link to={`/level/${info.LevelID}`} className='h3 underline'>{levelData?.info.Name || info.LevelID}</Link>
                <p>submitted by <a href={`/profile/${info.UserID}`} className='underline fw-bold' target='_blank' rel='noopener noreferrer'>{info.UserName}</a></p>
            </div>
            <div>
                <p>{'Device: ' + info.Device || 'None'}</p>
                <p>{'Refresh Rate: ' + (info.RefreshRate || 'None')}</p>
                <p>{'Rating: ' + (info.Rating || 'None')}</p>
                <p>{'Enjoyment: ' + (info.Enjoyment || 'None')}</p>
                <p>Proof: {info.Proof ? <a href={info.Proof} target='_blank' rel='noopener noreferrer'>{info.Proof}</a> : 'None'}</p>
            </div>
            <div className='d-flex justify-content-evenly'>
                <button className='primary px-3' onClick={() => approve(info)}>Approve</button>
                <button className='danger px-3' onClick={() => remove(info)}>Delete</button>
            </div>
        </div>
    );
}