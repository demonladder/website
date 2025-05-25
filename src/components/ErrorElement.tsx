import { useNavigate } from 'react-router-dom';
import { SecondaryButton } from './ui/buttons/SecondaryButton';
import { Helmet } from 'react-helmet-async';
import Header from '../layouts/header/Header';
import Footer from '../layouts/footer/Footer';
import Page from './Page';
import Heading1 from './headings/Heading1';

export default function ErrorElement() {
    const navigate = useNavigate();

    return (
        <div className='relative flex flex-col'>
            <Helmet>
                <title>Oops, an error occured</title>
            </Helmet>
            <Header />
            <Page>
                <div className='grid place-items-center' style={{ height: '100vh' }}>
                    <div className='text-center'>
                        <Heading1>Shoot dang, something went wrong!</Heading1>
                        <p className='text-lg'>Is this where people typically say "404 not found"?</p>
                        <SecondaryButton onClick={() => navigate('/')}>Home</SecondaryButton>
                    </div>
                </div>
            </Page>
            <Footer />
        </div>
    );
}
