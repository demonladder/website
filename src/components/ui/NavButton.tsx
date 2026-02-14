import { NavLink } from 'react-router';

interface Props {
    to: string;
    end?: boolean;
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function NavButton({ to, end = false, onClick, children }: Props) {
    return (
        <NavLink
            to={to}
            end={end}
            onClick={onClick}
            className={({ isActive }) =>
                (isActive ? 'bg-theme-600 font-bold' : 'hover:bg-theme-700') +
                ' px-3 py-2 round:rounded-lg transition-colors'
            }
        >
            {children}
        </NavLink>
    );
}
