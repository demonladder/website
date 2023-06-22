import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ErrorElement() {
    const navigate = useNavigate();

    return (
        <div className='errorElement'>
            <div>
                <h1>Shoot dang, something went wrong!</h1>
                <p>Is this where people typically say "404 not found"?</p>
                <button onClick={() => navigate(-1)} className='secondary px-3 bg-white text-dark'>Back</button>
            </div>
        </div>
    );
}