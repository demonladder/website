import React from 'react';
//import { useRouteError } from 'react-router-dom';

export default function ErrorElement() {
    return (
        <div className='text-center mt-5'>
            <h1>Shoot dang, something went wrong!</h1>
            <p>Is this where people typically say "404 not found"?</p>
            <a href='/' className='btn btn-secondary bg-white text-dark'>Back to home</a>
        </div>
    );
}