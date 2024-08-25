import { useNavigate } from 'react-router-dom';
import { SecondaryButton } from './Button';
import { Helmet } from 'react-helmet-async';
import Header from '../layouts/header/Header';
import Footer from '../layouts/footer/Footer';
import Container from './Container';

export default function ErrorElement() {
    const navigate = useNavigate();

    return (
        <div className='relative flex flex-col'>
            <Helmet>
                <title>Oops, an error occured</title>
            </Helmet>
            <Header />
            <main className='flex-grow over'>
                <Container>
                    <div className='grid place-items-center' style={{ height: '100vh' }}>
                        <div className='text-center'>
                            <h1 className='text-4xl'>Shoot dang, something went wrong!</h1>
                            <p className='text-lg mb-3'>Is this where people typically say "404 not found"?</p>
                            <SecondaryButton onClick={() => navigate('/')}>Home</SecondaryButton>
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
            {/* {getBrowserName() === 'Firefox' &&
                <div className='snow' />
            } */}
        </div>
    );
}