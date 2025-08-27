import { Outlet } from 'react-router';

export default function OAuth2Layout() {
    return (
        <div className='grid place-items-center min-h-dvh bg-cover' style={{ backgroundImage: 'url("/server-banner.png")' }}>
            <Outlet />
        </div>
    );
}
