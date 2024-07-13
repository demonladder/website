import { createContext, useContext, useEffect, useRef, useState } from 'react';

export interface ButtonData {
    text: string;
    onClick?: React.MouseEventHandler;
    type?: 'info' | 'danger';
    disabled?: boolean;
}

interface MenuData {
    x: number;
    y: number;
    buttons: ButtonData[];
}

const MenuContext = createContext<{ menuData: MenuData | undefined, setMenuData: React.Dispatch<React.SetStateAction<MenuData | undefined>> } | undefined>(undefined);

export default function MenuContextProvider({ children }: { children?: React.ReactNode }) {
    const [menuData, setMenuData] = useState<MenuData>();
    const menuRef = useRef<HTMLDivElement>(null);

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
        }
    }, []);

    function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, b: ButtonData) {
        if (b.onClick !== undefined) b.onClick(e);

        setMenuData(undefined);
    }

    return (
        <MenuContext.Provider value={{ menuData, setMenuData }}>
            {children}
            {menuData &&
                <div ref={menuRef} className='fixed w-36 z-50 bg-gray-900 text-white round:rounded shadow-2xl' style={{ left: `${menuData.x}px`, top: `${menuData.y}px` }}>{
                    <ul>{
                        menuData.buttons.map((b) => (
                            <li>
                                <button onClick={(e) => handleClick(e, b)} className={'w-full text-start my-1 px-2 py-1 disabled:text-gray-400 disabled:line-through ' + (!(b.type === 'danger') ? 'hover:bg-gray-700' : 'hover:bg-red-600')} disabled={b.disabled}>
                                    {b.text}
                                </button>
                            </li>
                        ))
                    }</ul>
                }</div>
            }
        </MenuContext.Provider>
    );
}

export function useContextMenu() {
    const context = useContext(MenuContext);

    return {
        createMenu: (data: MenuData) => {
            context?.setMenuData(data);
        },
        closeMenu: () => {
            context?.setMenuData(undefined);
        }
    };
}