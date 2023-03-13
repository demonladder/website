import React from 'react';
import BG from './BG';

export default function Index() {
    return (
        <div className='root'>
            <BG />
            <div className='container text-center py-5 mb-4'>
                <h1 className='tg-primary'>
                    Site is still WIP
                </h1>
                <p className='fs-5'>The data of this site is a copy of old sheet data. Any submissions and ratings may change in the future!</p>
            </div>
            <div className='container text-center py-5'>
                <h1 className='tg-primary'>
                    The project to improve demon difficulties
                </h1>
                <p className='fs-5'>The addition of demon difficulties in 2.1 is great. However, that isn't enough. With highly varying skill levels, this isn't of very high value as a reference. Compare ICDX to Bloodlust, Decode to Impact X, Windy Landscape to Nine Circles... argh! 5 demon difficulties is just not enough. This project divides all demons into 35 tiers, based on difficulty. Here, community votes are gathered to determine tiers of levels, and the results are published right here for everyone to search for their perfect demon to beat and compare demons to one another.</p>
            </div>
        </div>
    );
}