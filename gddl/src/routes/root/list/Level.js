import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DemonLogo from '../../../components/DemonLogo';
import Creator from '../level/Creator';

export default function Level({ info, isListView }) {
    function onIDClick() {
        if (info.isHeader) return;
        navigator.clipboard.writeText(info.ID);
    }

    if (isListView) {
        if (info.isHeader) {
            return (
                <div className='row level head'>
                    <h1 className='col-xl-4 col-lg-6 col-md-7 col-sm-7 col-10 m-0'>{info.Name}</h1>
        
                    <div className='col-xl-2 col-lg-3 col-md-3 d-none d-sm-inline-block col-sm-3 align-self-center'><Creator name='Creator' disableLink={true} /></div>
                    <div className='col-xl-3 d-none d-xl-block align-self-center'><p className='m-0'>Song</p></div>
                    <div className='col-xl-2 col-lg-2 d-none d-lg-block align-self-center'>ID</div>
                    <div className='col-lg-1 col-md-2 col-2 d-flex justify-content-center'><p className='m-0 align-self-center'>Rating</p></div>
                </div>
            );
        }

        return (
            <div className='row level list'>
                <h3 className={(info.isHeader ? 'h1 ' : '') + 'col-xl-4 col-lg-6 col-md-7 col-sm-7 col-10 m-0'}>
                    <Link to={'/level/' + info.ID} className='link-disable'>{info.Name}</Link>
                </h3>

                <div className='col-xl-2 col-lg-3 col-md-3 d-none d-sm-inline-block col-sm-3 align-self-center'><Creator name={info.Creator} disableLink={false} /></div>
                <div className='col-xl-3 d-none d-xl-block align-self-center'><p className='m-0'>{info.Song}</p></div>
                <div className='col-xl-2 col-lg-2 d-none d-lg-block align-self-center'><button className='m-0 style-link' onClick={onIDClick}>{info.ID}</button></div>
                <div className={`col-lg-1 col-md-2 col-2 d-flex justify-content-center tier-${Math.floor(info.Rating)}`}><p className='m-0 align-self-center'>{info.Rating === 0 ? 'Unrated' : `${info.Rating.toFixed(2)}`}</p></div>
            </div>
        );
    }

    if (info.isHeader) return null;

    const navigate = useNavigate();
    function handleClick() {
        navigate('/level/' + info.ID);
    }

    const roundedTier = Math.round(info.Rating);
    return (
        <div className={`level grid tier-${roundedTier}`} onClick={handleClick}>
            <div className='d-flex justify-content-between'>
                <div className='info flex-shrink-1'>
                    <h1 className='text-break'>{info.Name}</h1>
                    <h3>by {info.Creator}</h3>
                    { roundedTier !== 0 ?
                        <h3>Tier <b>{roundedTier}</b></h3> :
                        <h3>Unrated</h3>
                    }
                </div>
                <div>
                    <img src={DemonLogo(info.Difficulty)} alt='' />
                </div>
            </div>
        </div>
    );
}