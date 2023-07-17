import { Form, redirect, useActionData } from 'react-router-dom';
import serverIP from '../../../serverIP';
import axios from 'axios';
import { StorageManager } from '../../../storageManager';

async function loginAction({ request }: {request: any}) {
    const data = await request.formData();

    try {
        const response = await axios.post(`${serverIP}/login`, {
            username: data.get('username'),
            password: data.get('password')
        }, {
            withCredentials: true
        });

        if (response.status === 200) {
            StorageManager.setCSRF(response.data.csrfToken);
            StorageManager.setUser(response.data.jwt);
            return redirect('/');
        }
    } catch (err: any) {
        return err.response.data;
    }

    return null;
}

function Login() {
    const actionError = useActionData() as any;

    return (
        <div className='container'>
            <div className='d-flex justify-content-center'>
                <Form method='post' action='/login' className='w-75 w-md-50'>
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
                <h3>{actionError?.error || ''}</h3>
            </div>
        </div>
    );
}

export default Object.assign(Login, {
    loginAction,
});