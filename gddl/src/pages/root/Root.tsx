import Header from '../../layouts/header/Header';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Footer from '../../layouts/footer/Footer';

function Root() {
    return (
        <div className='flex flex-col'>
            <Helmet>
                <title>GD Demon Ladder</title>
            </Helmet>
            <Header />
            <main className='flex-grow'>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Root;
