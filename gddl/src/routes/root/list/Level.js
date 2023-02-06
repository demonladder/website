import React from 'react';
import { Link } from 'react-router-dom';
import Creator from '../../level/Creator';
import './Level.css';

export default function Level({ info }) {
    return (
        <div className='row level'>
            <h3 className={(info.isHeader ? 'h1 ' : '') + 'col-5'}>
                {info.isHeader ? <p className='m-0'>{info.Name}</p>
                               : <Link to={'/level/' + info.ID} className='link-disable'>{info.Name}</Link>}
            </h3>
            <div className='col-2 align-self-center'><Creator name={info.Creator} disableLink={info.isHeader} /></div>
            <div className='col-2 align-self-center'><p className='m-0'>{info.Song}</p></div>
            <div className='col-2 align-self-center'><p className='m-0'>{info.ID}</p></div>
            {/* eslint-disable-next-line*/}
            <div className='col-1 align-self-center'><p className='m-0'>{info.Rating == -1 ? 'Unrated' : info.Rating}</p></div>
        </div>
    );
}