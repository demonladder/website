import React from 'react';
import { Link } from 'react-router-dom';
import Creator from '../level/Creator'

export default function Level({ info }) {
    function onIDClick() {
        if (info.isHeader) return;
        navigator.clipboard.writeText(info.LevelID);
    }

    return (
        <div className='row level'>
            <h3 className={(info.isHeader ? 'h1 ' : '') + 'col-xl-5 col-lg-5 col-sm-8 col-8'}>
                {info.isHeader ? <p className='m-0'>{info.Name}</p>
                               : <Link to={'/level/' + info.LevelID} className='link-disable'>{info.Name}</Link>}
            </h3>
            <div className='col-xl-2 d-none d-xl-block align-self-center'><Creator name={info.Creator} disableLink={info.isHeader} /></div>
            <div className='col-2 d-none d-lg-block align-self-center'><button className='m-0 style-link' onClick={onIDClick}>{info.LevelID}</button></div>
            <div className='col-xl-1 col-sm-2 col-2 align-self-center text-end'><p className='m-0'>{info.UserRating === -1 ? 'NaN' : info.UserRating}</p></div>
            <div className='col-xl-1 col-sm-2 col-2 align-self-center text-end'><p className='m-0'>{info.Enjoyment === -1 ? 'NaN' : info.Enjoyment}</p></div>
            <div className={`col-lg-1 col-1 d-none d-lg-flex justify-content-center col-sm-2 text-center tier-${Math.floor(info.Rating)}`}><p className='m-0 align-self-center'>{info.Rating === -1 ? 'Unrated' : info.Rating}</p></div>
        </div>
    );
}