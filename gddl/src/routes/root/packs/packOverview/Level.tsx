import React from 'react';
import IDButton from '../../../../components/IDButton';
import { Link } from 'react-router-dom';
import { PackLevel } from '../../../../api/packs';

type Props = {
    isHeader?: boolean,
    info: PackLevel,
}

function Header() {
    return (
        <div className='level head ps-2'>
            <h3 className='col-10 col-sm-7 col-md-7 col-lg-6 col-xl-4'>Level Name</h3>
            <h3 className='col-sm-3 col-md-3 col-lg-3 col-xl-2 d-none d-sm-inline-block'>Creator</h3>
            <h3 className='col-xl-3 d-none d-xl-block'>Song</h3>
            <h3 className='col-lg-2 col-xl-2 d-none d-lg-block text-center'>ID</h3>
            <h3 className='col-lg-1 col-md-2 col-2 d-flex justify-content-center'><p className='align-self-center'>Tier</p></h3>
        </div>
    );
}

function Level({ info }: Props) {
    const roundedTier = Math.round(info.Rating);

    return (
        <div className='level list ps-2'>
            <h4 className='col-xl-4 col-lg-6 col-md-7 col-sm-7 col-10 m-0 align-self-center'>
                <Link to={'/level/' + info.ID} className='underline-p'>{info.Name}</Link>
            </h4>

            <div className='col-xl-2 col-lg-3 col-md-3 d-none d-sm-inline-block col-sm-3 align-self-center'><p>{info.Creator}</p></div>
            <div className='col-xl-3 d-none d-xl-block align-self-center'><p>{info.Song}</p></div>
            <div className='col-xl-2 col-lg-2 d-none d-lg-block align-self-center'><IDButton className='id-button underline-p' id={info.ID} /></div>
            <div className={`col-lg-1 col-md-2 col-2 d-flex justify-content-center tier-${roundedTier}`}><p className='align-self-center'>{roundedTier}</p></div>
        </div>
    );
}

export default Object.assign(Level, {
    Header,
});