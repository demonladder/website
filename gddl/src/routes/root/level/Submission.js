import React from 'react';

export default function Submission({ submission }) {
    return (
        <div className='submission-ref'>
            <p className='rating'>{submission.Rating || 'N/A'}</p>
            <p className='enjoyment'>{submission.Enjoyment || 'N/A'}</p>
            <a className='name' href={'/profile/' + submission.UserID}>{submission.Name}</a>
        </div>
    );
}