import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className='bg-dark'>
            <div className='container py-4 d-flex justify-content-between'>
                <div className='d-flex'>
                    <Link to={''} className='h1 me-4 text-decoration-none'>
                        GDDLadder
                    </Link>
                    <div className='d-flex align-items-end'>
                        <Link to={'list'} className='my-2 nav'>
                            The Ladder
                        </Link>
                        <Link to={'references'} className='my-2 nav'>
                            Reference Demons
                        </Link>
                        <Link to={'packs'} className='my-2 nav'>
                            Packs
                        </Link>
                    </div>
                </div>
                <div className='align-self-center d-flex'>
                    <button className='align-middle'>
                        Log in
                    </button>
                </div>
            </div>
        </header>
    );
}