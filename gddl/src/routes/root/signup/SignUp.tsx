import { useState } from 'react';
import { AxiosError } from 'axios';
import { Form, redirect, useActionData, useLocation } from 'react-router-dom';
import { StorageManager } from '../../../storageManager';
import instance from '../../../api/axios';
import Container from '../../../components/Container';
import { PasswordInput, TextInput } from '../../../components/Input';
import { PrimaryButton } from '../../../components/Button';

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
        <Container className='bg-gray-800'>
            <div className='flex justify-center'>
                <div className='w-11/12 md:w-1/2 lg:w-2/6'>
                    <h1 className='text-4xl'>Sign Up</h1>
                    <div className='my-6'>
                        <p>Already have your name on the sheet? Contact the mod team to get an alternative sign up link.</p>
                    </div>
                    <Form method='post' action='/signup'>
                        <div className='mb-3'>
                            <label htmlFor='username'>Username</label>
                            <TextInput id='username' value={username} onChange={(e) => setUsername(e.target.value)} name='username' />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='password'>Password</label>
                            <PasswordInput id='password' name='password' />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='confirmPassword'>Confirm password</label>
                            <PasswordInput id='confirmPassword' name='password2' />
                        </div>
                        <PrimaryButton type='submit' className='w-full'>Sign Up</PrimaryButton>
                        <input name='key' value={overrideKey} onChange={() => {}} hidden />
                    </Form>
                </div>
            </div>
            <div className='d-flex justify-content-center m-5'>
                <h3>{(actionResponse && typeof actionResponse === 'string') ? actionResponse : ''}</h3>
            </div>
        </Container>
    );
}

export default Object.assign(SignUp, {
    Action,
});