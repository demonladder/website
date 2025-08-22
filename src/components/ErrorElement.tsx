import { Link, useRouteError } from 'react-router';
import Page from './Page';
import Heading1 from './headings/Heading1';
import TonalButton from './input/buttons/tonal/TonalButton';

export default function ErrorElement() {
    const error = useRouteError();

    return (
        <Page title='Oops, an error occured'>
            <div className='grid place-items-center'>
                <div className='flex flex-col gap-4 items-center'>
                    <Heading1>Shoot dang, something went wrong!</Heading1>
                    <div className='text-center'>
                        <p className='text-lg'>There was an error trying to load the page.</p>
                        {error instanceof Error &&
                            <p>Error message: <b>{error.message}</b></p>
                        }
                    </div>
                    <Link to='/'><TonalButton size='xs'>Home</TonalButton></Link>
                </div>
            </div>
        </Page>
    );
}
