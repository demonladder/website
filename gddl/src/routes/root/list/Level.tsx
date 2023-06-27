import React from 'react';
import DemonLogo from '../../../components/DemonLogo';
import IDButton from '../../../components/IDButton';
import { Level as TLevel } from '../../../api/levels';
import { Link, useNavigate } from 'react-router-dom';

type Props = {
    isHeader?: boolean,
    info: TLevel,
}

function Header() {
    return (
        <div className='level head ps-2 cursor-default'>
            <h4 className='col-10 col-sm-7 col-md-7 col-lg-6 col-xl-4'>Level Name</h4>
            <h4 className='col-sm-3 col-md-3 col-lg-3 col-xl-2 d-none d-sm-inline-block'>Creator</h4>
            <h4 className='col-xl-3 d-none d-xl-block'>Song</h4>
            <h4 className='col-lg-2 col-xl-2 d-none d-lg-block text-center'>ID</h4>
            <h4 className='col-lg-1 col-md-2 col-2 d-flex justify-content-center'><p className='align-self-center'>Tier</p></h4>
        </div>
    );
}

function Grid({ info }: Props) {
    const navigate = useNavigate();
    function handleClick() {
        navigate('/level/' + info.ID);
    }

    const roundedTier = Math.round(info.Rating);
    const roundedEnjoyment = Math.round(info.Enjoyment);
    return (
        <div className={`level grid tier-${roundedTier}`} onClick={handleClick}>
            <h1 className='text-break'>{info.Name}</h1>
            <div className='d-flex justify-content-between'>
                <div className='info'>
                    <h3 className='created-by'>by {info.Creator}</h3>
                    { roundedTier !== 0 ?
                        <h3>Tier <b>{roundedTier}</b></h3> :
                        <h3>Unrated</h3>
                    }
                    { roundedTier !== 0 ?
                        <h3>Enjoyment <b>{roundedEnjoyment}</b></h3> :
                        <h3>Enjoyment -</h3>
                    }
                </div>
                <img src={DemonLogo(info.Difficulty)} alt='' />
            </div>
        </div>
    );
}

function Level({ info }: Props) {
    const roundedTier = Math.round(info.Rating) || '-';
    const tierClass = 'tier-' + Math.round(info.Rating);

    return (
        <div className='level list ps-2'>
            <h4 className='col-xl-4 col-lg-6 col-md-7 col-sm-7 col-10 m-0 align-self-center'>
                <Link to={'/level/' + info.ID} className='underline-p text-break'>{info.Name}</Link>
            </h4>

            <div className='col-xl-2 col-lg-3 col-md-3 d-none d-sm-inline-block col-sm-3 align-self-center'><p className='cursor-default'>{info.Creator}</p></div>
            <div className='col-xl-3 d-none d-xl-block align-self-center'><p className='cursor-default'>{info.Song}</p></div>
            <div className='col-xl-2 col-lg-2 d-none d-lg-block align-self-center'><IDButton className='id-button underline-p' id={info.ID} /></div>
            <div className={`col-lg-1 col-md-2 col-2 d-flex justify-content-center ${tierClass}`}><p className='align-self-center cursor-default'>{roundedTier}</p></div>
        </div>
    );
}

export default Object.assign(Level, {
    Header,
    Grid,
});