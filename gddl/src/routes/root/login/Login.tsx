import { Form, redirect, useActionData } from 'react-router-dom';
import serverIP from '../../../serverIP';
import axios, { AxiosError } from 'axios';
import { StorageManager } from '../../../storageManager';
import Container from '../../../components/Container';
import { PasswordInput, TextInput } from '../../../components/Input';
import { PrimaryButton } from '../../../components/Button';

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
    } catch (err) {
        return (err as AxiosError).response?.data || 'An error occurred';
    }

    return null;
}

function Login() {
    const actionError = useActionData() as any;

    return (
        <Container className='bg-gray-800'>
            <div className='flex justify-center'>
                <Form method='post' action='/login' className='w-11/12 md:w-1/2 lg:w-2/6'>
                    <h1 className='mb-4 text-4xl'>Login</h1>
                    <div className='mb-3'>
                        <label htmlFor='loginUsername'>Username</label>
                        <TextInput id='loginUsername' name='username' />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='loginPassword'>Password</label>
                        <PasswordInput id='loginPassword' name='password' />
                    </div>
                    <PrimaryButton type='submit' className='w-full'>Login</PrimaryButton>
                </Form>
            </div>
            <div className='text-center m-5'>
                <h3>{actionError?.error || ''}</h3>
            </div>
        </Container>
    );
}

export default Object.assign(Login, {
    loginAction,
});