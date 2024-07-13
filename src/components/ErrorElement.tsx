import { useNavigate } from 'react-router-dom';
import { SecondaryButton } from './Button';

export default function ErrorElement() {
    const navigate = useNavigate();

    return (
        <div className='grid place-items-center' style={{ height: '100vh'}}>
            <div className='text-center'>
                <h1 className='text-4xl'>Shoot dang, something went wrong!</h1>
                <p className='text-lg mb-3'>Is this where people typically say "404 not found"?</p>
                <SecondaryButton onClick={() => navigate(-1)}>Back</SecondaryButton>
            </div>
        </div>
    );
}