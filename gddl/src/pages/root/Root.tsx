import Header from '../../layouts/header/Header';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';

function Root() {
    return (
        <>
            <Helmet>
                <title>GD Demon Ladder</title>
            </Helmet>
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default Root;
