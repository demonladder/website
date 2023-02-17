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
            <h3 className={(info.isHeader ? 'h1 ' : '') + 'col-xl-5 col-lg-4 col-sm-8 col-9'}>
                {info.isHeader ? <p className='m-0'>{info.Name}</p>
                               : <Link to={'/level/' + info.LevelID} className='link-disable'>{info.Name}</Link>}
            </h3>
            <div className='col-lg-3 d-none d-lg-block align-self-center'><Creator name={info.Creator} disableLink={info.isHeader} /></div>
            <div className='col-2 d-none d-lg-block align-self-center'><button className='m-0 style-link' onClick={onIDClick}>{info.LevelID}</button></div>
            {/* eslint-disable-next-line*/}
            <div className={`col-lg-1 col-1 d-none d-sm-flex justify-content-center col-sm-2 text-center tier-${Math.floor(info.Rating)}`}><p className='m-0 align-self-center'>{info.Rating == -1 ? 'Unrated' : info.Rating}</p></div>
            <div className='col-xl-1 col-lg-2 col-sm-2 col-3 align-self-center text-end'><p className='m-0'>{info.Progress === -1 ? 'NaN' : info.Progress}</p></div>
        </div>
    );
}