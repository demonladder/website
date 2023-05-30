import React from 'react';
import { Submission as TSubmission } from '../../../api/submissions';

type Props = {
    submission: TSubmission,
}

export default function Submission({ submission }: Props) {
    const enj = submission.Enjoyment == null ? '-1' : submission.Enjoyment;
    const enjText = submission.Enjoyment == null ? 'N/A' : submission.Enjoyment;
    return (
        <div className='submission-ref'>
            <p className={'rating tier-' + (submission.Rating ? submission.Rating : '0')}>{submission.Rating || 'N/A'}</p>
            <p className={'enjoyment enj-' + enj}>{enjText}</p>
            <a className='name' href={'/profile/' + submission.UserID}>{submission.Name}</a>
        </div>
    );
}