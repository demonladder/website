import { Link } from 'react-router';
import Heading1 from '../../../components/headings/Heading1';
import FilledButton from '../../../components/input/buttons/filled/FilledButton';

export default function Invalid() {
    return (
        <div className='bg-theme-800 rounded-2xl text-theme-text p-4 border border-theme-700 shadow-xl max-sm:w-full sm:min-w-md'>
            <Heading1>Authorization Request Error</Heading1>
            <p className='my-8'>The application made an invalid request; authorization cannot continue.</p>
            <Link to='/'><FilledButton className='w-full'>Back to safety</FilledButton></Link>
        </div>
    );
}
