import React from 'react';
import { Submission } from '../../../api/submissions';

type Props = {
    isHeader: boolean,
    info?: Submission,
}

export default function Level({ info, isHeader }: Props) {
    if (isHeader || !info) {
        return (
            <div className='submission'>
                <h3 className='level-name'>Level Name</h3>
                <div className='creator'><h3>Creator</h3></div>
                <div className='user-rating'><h3>Rating</h3></div>
                <div className='enjoyment'><h3>Enj</h3></div>
            </div>
        );
    }

    const userRating = info.Rating ? info.Rating : '-';
    const userEnjoyment = info.Enjoyment ? (info.Enjoyment === -1 ? '-' : info.Enjoyment) : '-';

    return (
        <div className='submission'>
            <h3 className='level-name'><a href={'/level/' + info.LevelID} target='_blank' rel='noopener noreferrer' className='underline text-light'>{info.Name}</a></h3>
            <div className='creator'><p>{info.Creator}</p></div>
            <div className={'user-rating tier-' + userRating}><p>{userRating}</p></div>
            <div className={'enjoyment enj-' + userEnjoyment}><p>{userEnjoyment}</p></div>
        </div>
    );
}