import React from 'react';
import { Form, Link, redirect } from 'react-router-dom';

export async function searchAction({ request, params}) {
    const formData = await request.formData();
    let query = formData.get('query');
    let level;
    if (isNaN(parseInt(query))) {
        level = await fetch('http://localhost:8080/search?name=' + query)
            .then((res) => res.json());
    } else {
        level = await fetch('http://localhost:8080/search?id=' + query)
                .then((res) => res.json());
    }
    
    return redirect(`/level/${level[0].id}`);
}

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
                    <Form className='me-2' id='search-form' role='search'>
                        <input type='search' placeholder='Search level...' className='form-control' name='query'></input>
                    </Form>
                    <button className='align-middle'>
                        Log in
                    </button>
                </div>
            </div>
        </header>
    );
}