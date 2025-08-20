import { NavLink } from 'react-router';
import { Route } from './types/Route';

interface Props {
    route: Route;
    size: 'wide' | 'thin';
}

export default function NavItem({ route, size }: Props) {
    return (
        <div className='relative group'>
            <NavLink to={route.to} className={({ isActive }) => (isActive ? 'font-bold ' : '') + 'underline'}>{route.name}{((route.subroutes ?? []).length > 0 && size === 'wide') && (<i className='bx bx-chevron-down' />)}</NavLink>
            {size === 'wide'
                ? (
                    <div className='opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all absolute z-10 w-max py-2 shadow-lg bg-theme-header'>
                        {route.subroutes?.map((subRoute, i) => (
                            <div key={`subNavItem_${i}`}>
                                <NavLink to={subRoute.to} className={({ isActive }) => (isActive ? 'font-bold ' : '') + 'underline mx-2'}>{subRoute.name}</NavLink>
                            </div>
                        ))}
                    </div>
                )
                : (
                    <div>
                        {route.subroutes?.map((subRoute, i ) => (
                            <div key={`subNavItem_${i}`}>
                                <NavLink to={subRoute.to} className={({ isActive }) => (isActive ? 'font-bold ' : '') + 'underline ms-4'}>{subRoute.name}</NavLink>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    );
}
