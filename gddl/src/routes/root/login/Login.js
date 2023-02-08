import React from 'react';
import { Form, redirect, useActionData } from 'react-router-dom';

export async function loginAction({ request }) {
    let data = await request.formData();

    let response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: data.get('username'),
            password: data.get('password')
        })
    })
    .then(res => res.json());

    if (response.error) {
        return response;
    }
    
    return redirect('/');
}

export default function Login() {
    let actionError = useActionData();

    return (
        <div className='container'>
            <div className='d-flex justify-content-center'>
                <Form method='POST' action='/login' className='w-25'>
                    <h1 className='mb-3 fw-normal text-white'>Login</h1>
                    <div className='mb-3'>
                        <label className='form-label'>Username</label>
                        <input type='text' name='username' className='form-control' />
                    </div>
                    <div className='mb-3'>
                        <label className='form-label'>Password</label>
                        <input type='password' name='password' className='form-control' />
                    </div>
                    <button type='submit' className='btn btn-lg btn-primary w-100'>Login</button>
                </Form>
            </div>
            <div className='d-flex justify-content-center m-5'>
                <h3>{actionError ? actionError.error : ''}</h3>
            </div>
        </div>
    );
}