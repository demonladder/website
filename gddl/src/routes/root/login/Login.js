import React from 'react';
import { Form, redirect, useActionData } from 'react-router-dom';
import serverIP from '../../../serverIP';
import axios from 'axios';
import { setUser } from '../../../storageManager';

export async function loginAction({ request }) {
    const data = await request.formData();

    try {
        const response = await axios.post(`${serverIP}/login`, {
            username: data.get('username'),
            password: data.get('password')
        }, {
            withCredentials: true
        });

        if (response.status === 200) {
            setUser(response.data.csrfToken, JSON.stringify(response.data.user));
            return redirect('/');
        }
    } catch (err) {
        return { message: err.response.data };
    }

    //const queryClient = useQueryClient();
    //queryClient.invalidateQueries(['user']);
    return null;
}

export default function Login() {
    const actionError = useActionData();

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
                    <button type='submit' className='primary w-100'>Login</button>
                </Form>
            </div>
            <div className='d-flex justify-content-center m-5'>
                <h3>{actionError ? actionError.message : ''}</h3>
            </div>
        </div>
    );
}