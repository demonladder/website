import Header from '../../layouts/Header';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import StorageManager from '../../utils/StorageManager';

function Root() {
    return (
        <>
            <Helmet>
                <title>GD Demon Ladder</title>
            </Helmet>
            <Header />
            <main className={StorageManager.getIsRounded() ? 'round' : ''}>
                <Outlet />
            </main>
        </>
    );
}

export default Root;
