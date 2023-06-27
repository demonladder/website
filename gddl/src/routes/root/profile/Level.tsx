import React from 'react';
import { Submission } from '../../../api/submissions';
import { Link } from 'react-router-dom';

type Props = {
    isHeader: boolean,
    info?: Submission,
}

export default function Level({ info, isHeader }: Props) {
    if (isHeader || !info) {
        return (
            <div className='submission header'>
                <h3 className='level-name'>Level Name</h3>
                <div className='creator'><h3>Creator</h3></div>
                <div className='user-rating'><h3>Tier</h3></div>
                <div className='enjoyment'><h3>Enj</h3></div>
            </div>
        );
    }

    const userRating = info.Rating ? info.Rating : '-';
    const userEnjoyment = info.Enjoyment !== null ? (info.Enjoyment === -1 ? '-' : info.Enjoyment) : '-';

    return (
        <div className='submission'>
            <h4 className='level-name'><Link to={'/level/' + info.LevelID} className='underline text-light'>{info.Name}</Link></h4>
            <p className='creator'>{info.Creator}</p>
            <div className={'user-rating cursor-default tier-' + userRating}><p>{userRating}</p></div>
            <div className={'enjoyment cursor-default enj-' + userEnjoyment}><p>{userEnjoyment}</p></div>
        </div>
    );
}