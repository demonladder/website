import React from 'react';
import eDemon from '../../../demon_logos/edemon.png';

export default function ProfileButton({ userID }) {
    return (
        <div className='style-none'>
            <button className='style-none'>
                <img className='pfp' src={eDemon} alt='' />
            </button>
        </div>
    );
}