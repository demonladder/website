import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
//coolors.co/efa51c-998888-833a91-2c0e6c-191716

export default function Header() {
    return (
        <header className='bg-gddl text-dark'>
            <div className='container py-4 d-flex justify-content-between'>
                <div className='d-flex'>
                    <Link to={''} className='h1 me-4 text-decoration-none'>
                        GDDLadder
                    </Link>
                    <div className='d-flex align-items-end'>
                        <Link to={'list'} className='my-2 nav text-dark'>
                            The Ladder
                        </Link>
                        <Link to={'references'} className='my-2 nav text-dark'>
                            Reference Demons
                        </Link>
                        <Link to={'packs'} className='my-2 nav text-dark'>
                            Packs
                        </Link>
                    </div>
                </div>
                <div className='align-self-center d-flex'>
                    <button className='align-middle px-3 py-2'>
                        Log in
                    </button>
                </div>
            </div>
        </header>
    );
}