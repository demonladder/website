import { Link, useRouteError } from 'react-router';
import Heading1 from './headings/Heading1';
import TonalButton from './input/buttons/tonal/TonalButton';

export default function ErrorElement() {
    const error = useRouteError();

    return (
        <div className='grid place-items-center bg-theme-900 text-theme-text min-h-dvh'>
            <title>Oops, an error occured</title>
            <div className='flex flex-col gap-4 items-center'>
                <Heading1>Oops</Heading1>
                <p className='text-lg'>Something went wrong while trying to load the page.</p>
                {error instanceof Error &&
                    <p>Error message: <b>{error.message}</b></p>
                }
                <Link to='/'><TonalButton size='xs'>Home</TonalButton></Link>
            </div>
        </div>
    );
}
