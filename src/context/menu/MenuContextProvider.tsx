import { useEffect, useMemo, useRef, useState } from 'react';
import { MenuContext } from './MenuContext';
import { PermissionFlags } from '../../features/admin/roles/PermissionFlags';
import useSession from '../../hooks/useSession';
import { Link } from 'react-router';

export interface ButtonData {
    text?: React.ReactNode;
    icon?: React.ReactNode;
    to?: string;
    onClick?: React.MouseEventHandler;
    type?: 'info' | 'danger' | 'divider';
    disabled?: boolean;
    ID?: string;
    requireSession?: boolean;
    permission?: PermissionFlags;
    userID?: number;
}

export interface MenuData {
    x: number;
    y: number;
    buttons: ButtonData[];
}

export default function MenuContextProvider({ children }: { children?: React.ReactNode }) {
    const [menuData, setMenuData] = useState<MenuData>();
    const menuRef = useRef<HTMLDivElement>(null);
    const session = useSession();

    useEffect(() => {
        function close(e: MouseEvent) {
            // Only close if the event target wasn't the context menu
            if ((e.target as HTMLDivElement).offsetParent != menuRef.current) {
                setMenuData(undefined);
            }
        }

        function closeOnScroll() {
            setMenuData(undefined);
        }

        document.addEventListener('click', close);
        document.addEventListener('scroll', closeOnScroll);

        return () => {
            document.removeEventListener('click', close);
            document.removeEventListener('scroll', closeOnScroll);
        };
    }, []);

    function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, b: ButtonData) {
        if (b.onClick !== undefined) b.onClick(e);

        setMenuData(undefined);
    }

    const filteredButtons = useMemo(
        () =>
            menuData?.buttons.filter((button) => {
                if (button.requireSession && !session.user) return false;
                if (button.permission && !session.hasPermission(button.permission)) return false;
                return !(button.userID && button.userID !== session.user?.ID);
            }),
        [menuData?.buttons, session],
    );

    return (
        <MenuContext.Provider value={{ menuData, setMenuData }}>
            {children}
            {menuData && (
                <div
                    ref={menuRef}
                    className='fixed z-50 bg-theme-900 text-theme-text rounded-lg border border-theme-400 shadow-2xl'
                    style={{ left: `${menuData.x}px`, top: `${menuData.y}px` }}
                >
                    {
                        <ul className='p-1'>
                            {filteredButtons?.map((b) =>
                                b.type === 'divider' ? (
                                    <li key={b.ID} className='bg-theme-500 mx-2 h-0.5 my-1' />
                                ) : (
                                    <li key={b.ID}>
                                        {b.to ? (
                                            <Link
                                                to={b.to}
                                                onClick={() => setMenuData(undefined)}
                                                className={
                                                    'inline-block w-full text-start pe-4 py-1 rounded ' +
                                                    (!(b.type === 'danger')
                                                        ? 'hover:bg-theme-700'
                                                        : 'hover:bg-red-600') +
                                                    (b.disabled
                                                        ? ' text-theme-400 line-through pointer-events-none'
                                                        : '')
                                                }
                                            >
                                                <span className='inline-block w-4 mx-2'>{b.icon}</span>
                                                {b.text}
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={(e) => handleClick(e, b)}
                                                className={
                                                    'w-full text-start pe-4 py-1 rounded ' +
                                                    (!(b.type === 'danger')
                                                        ? 'hover:bg-theme-700'
                                                        : 'hover:bg-red-600') +
                                                    (b.disabled
                                                        ? ' text-theme-400 line-through pointer-events-none'
                                                        : '')
                                                }
                                            >
                                                <span className='inline-block w-4 mx-2'>{b.icon}</span>
                                                {b.text}
                                            </button>
                                        )}
                                    </li>
                                ),
                            )}
                        </ul>
                    }
                </div>
            )}
        </MenuContext.Provider>
    );
}
