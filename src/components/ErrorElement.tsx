import { Link, useRouteError } from 'react-router';
import { Heading1 } from './headings';
import { SecondaryButton } from './ui/buttons/SecondaryButton';
import { AxiosError } from 'axios';
import type { GDDLError } from '../utils/renderToastError';

export default function ErrorElement() {
    const error = useRouteError();

    let errorMessage = 'An unknown error has occurred';
    if (error instanceof Error) {
        errorMessage = error.message;

        if (error instanceof AxiosError) {
            const msg = (error.response?.data as GDDLError).message ?? error.message;
            if (Array.isArray(msg)) errorMessage = msg[0];
            else errorMessage = msg;
        }
    }

    return (
        <div className='grid place-items-center bg-theme-900 text-theme-text min-h-dvh'>
            <title>Oops, an error occurred</title>
            <div className='flex flex-col gap-4 items-center'>
                <Heading1>Oops</Heading1>
                <p className='text-lg'>Something went wrong while trying to load the page.</p>
                {error instanceof Error && (
                    <p>
                        Error message: <b>{errorMessage}</b>
                    </p>
                )}
                <Link to='/'>
                    <SecondaryButton>Home</SecondaryButton>
                </Link>
            </div>
        </div>
    );
}
