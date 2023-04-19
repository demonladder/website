import React from 'react';

export default function Submission({ submission }) {
    return (
        <div className='submission-ref'>
            <p className={'rating tier-' + (submission.Rating ? submission.Rating : '0')}>{submission.Rating || 'N/A'}</p>
            <p className={'enjoyment enj-' + (submission.Enjoyment ? submission.Enjoyment : '-1')}>{submission.Enjoyment || 'N/A'}</p>
            <a className='name' href={'/profile/' + submission.UserID}>{submission.Name}</a>
        </div>
    );
}