import { NavLink } from 'react-router-dom';

export function NavButton({ to, end = false, children }: { to: string; end?: boolean; children: React.ReactNode; }) {
    return (
        <NavLink to={to} end={end} className={({ isActive }) => (isActive ? 'bg-theme-600 font-bold' : 'hover:bg-theme-700') + ' px-3 py-2 round:rounded-lg transition-colors'}>{children}</NavLink>
    );
}
