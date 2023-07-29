import Header from '../../Header';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { StorageManager } from '../../storageManager';

function Root() {
    return (
        <>
            <Helmet>
                <title>GD Demon Ladder</title>
                <meta property='og:type' content='website' />
                <meta property='og:title' content='GDDLadder' />
                <meta property='og:url' content='https://gdladder.com' />
                <meta property='og:description' content='The project to improve demon difficulties' />
            </Helmet>
            <div className={StorageManager.getIsRounded() ? 'round' : ''}>
                <Header />
                <Outlet />
            </div>
        </>
    );
}

export default Root;
