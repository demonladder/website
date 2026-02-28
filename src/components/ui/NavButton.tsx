import { NavLink } from 'react-router';

interface Props {
    icon?: React.ReactNode;
    to: string;
    end?: boolean;
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function NavButton({ icon, to, end = false, onClick, children }: Props) {
    return (
        <NavLink
            to={to}
            end={end}
            onClick={onClick}
            className={({ isActive }) =>
                (isActive ? 'bg-theme-600 font-bold' : 'hover:bg-theme-700') +
                ' px-3 py-2 round:rounded-lg transition-colors flex gap-2'
            }
        >
            <span className='max-md:min-w-7 min-w-6'>{icon}</span>
            <span>{children}</span>
        </NavLink>
    );
}
