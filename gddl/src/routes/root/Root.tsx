import Header from '../../Header';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { StorageManager } from '../../storageManager';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import serverIP from '../../serverIP';

function Root() {
    useWebSocket(serverIP.wsServerIP, {
        onMessage: (event) => {
            if (event.data === 'userSubmission') {
                if (StorageManager.hasPermissions() && Notification.permission === 'granted' && StorageManager.wantsNotifs()) {
                    new Notification('New submission');
                }
            }
        }
    });

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
