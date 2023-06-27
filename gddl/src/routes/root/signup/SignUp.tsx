import React, { useState } from 'react';
import { AxiosError } from 'axios';
import { Form, redirect, useActionData, useLocation } from 'react-router-dom';
import { StorageManager } from '../../../storageManager';
import instance from '../../../api/axios';

function Action({ request }: { request: any }) {
    // Validate form data
    return request.formData().then((formData: any) => {
        const data = Object.fromEntries(formData);

        if (data.password.length < 7) {
            return 'Password must be over 6 characters long!';
        }
        
        if (data.password !== data.password2) {
            return 'Passwords do not match!';
        }
        
        // Make post request
        return instance.post('/login/signup', { username: data.username, password: data.password, overrideKey: data.key }, { withCredentials: true }).then((res) => {
            StorageManager.setCSRF(res.data.csrfToken);
            StorageManager.setUser(res.data.jwt);
            
            return redirect('/');
        }).catch((error: AxiosError) => {
            if (error.response?.status === 422) {
                return 'User already exists!';
            }

            if (error.response?.status === 500) {
                return 'Server error, try again later!';
            }

            return (error.response?.data as any).error || 'An error ocurred';
        });
    });
}

function SignUp() {
    const actionResponse: any = useActionData();
    const url = new URLSearchParams(useLocation().search);
    const overrideKey = url.get('key') || '';
    const [username, setUsername] = useState(url.get('name') || '');

    return (
        <div className='container'>
            <div className='d-flex justify-content-center'>
                <div className='w-75 w-md-50'>
                    <h1 className='mb-3 fw-normal text-white'>Sign Up</h1>
                    <div className='my-4'>
                        <p>Already have your name on the sheet? Contact the mod team to get an alternative sign up link.</p>
                    </div>
                    <Form method='post' action='/signup'>
                        <div className='mb-3'>
                            <label htmlFor='username'>Username</label>
                            <input type='text' id='username' value={username} onChange={(e) => setUsername(e.target.value)} name='username' className='form-control' />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='password'>Password</label>
                            <input type='password' id='password' name='password' className='form-control' />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='confirmPassword'>Confirm password</label>
                            <input type='password' id='confirmPassword' name='password2' className='form-control' />
                        </div>
                        <button type='submit' className='primary w-100'>Sign Up</button>
                        <input name='key' value={overrideKey} onChange={() => {}} hidden />
                    </Form>
                </div>
            </div>
            <div className='d-flex justify-content-center m-5'>
                <h3>{(typeof actionResponse === 'string' && actionResponse) || ''}</h3>
            </div>
        </div>
    );
}

export default Object.assign(SignUp, {
    Action,
});