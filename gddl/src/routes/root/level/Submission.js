import React from 'react';

export default function Submission({ submission }) {
    return (
        <div>
            <span>Tier {submission.Rating || 'N/A'}, </span>
            <span>Enjoyment {submission.Enjoyment || 'N/A'} </span>
            <span>by <a href={'/profile/' + submission.UserID}>{submission.Name}</a></span>
        </div>
    );
}