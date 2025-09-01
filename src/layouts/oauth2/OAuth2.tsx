import { Outlet } from 'react-router';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

export default function OAuth2Layout() {
    return (
        <QueryParamProvider adapter={ReactRouter6Adapter}>
            <div className='grid place-items-center min-h-dvh bg-cover' style={{ backgroundImage: 'url("/coding frog.png")' }}>
                <Outlet />
            </div>
        </QueryParamProvider>
    );
}
