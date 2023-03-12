import React from 'react';
import { Link } from 'react-router-dom';

export default function Level({ info }) {
    if (info.isHeader) {
        return (
            <div className='row'>
                <h3 className='col-7 col-lg-6 col-xl-4 level-name'>Level Name</h3>
                <h3 className='col-xl-2 d-none d-xl-block text-center'>Creator</h3>
                <h3 className='col-2 text-center'>Enj</h3>
                <h3 className='col-3 col-lg-2 text-center'>Rating</h3>
                <h3 className='col-lg-2 d-none d-lg-block text-center'>Tier</h3>
            </div>
        );
    }

    const userRating = info.UserRating ? info.UserRating : '-';
    const userEnjoyment = info.Enjoyment ? info.Enjoyment : '-';
    const rating = info.Rating === 0 ? 'Unrated' : (parseFloat(info.Rating).toFixed(2));

    return (
        <div className='row'>
            <h3 className='col-7 col-lg-6 col-xl-4 level-name'><Link to={'/level/' + info.LevelID} className='underline text-light'>{info.Name}</Link></h3>
            <div className='col-xl-2 d-none d-xl-flex creator'><p>{info.Creator}</p></div>
            <div className={'col-2 enjoyment enj-' + userEnjoyment}><p>{userEnjoyment}</p></div>
            <div className={'col-3 col-lg-2 user-rating tier-' + userRating}><p>{userRating}</p></div>
            <div className={`col-lg-2 d-none d-lg-flex rating tier-${Math.floor(info.Rating)}`}><p>{rating}</p></div>
        </div>
    );
}