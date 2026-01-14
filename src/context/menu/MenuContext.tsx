import { createContext } from 'react';
import { MenuData } from './MenuContextProvider';

export const MenuContext = createContext<{
    menuData: MenuData | undefined;
    setMenuData: React.Dispatch<React.SetStateAction<MenuData | undefined>>;
} | undefined>(undefined);
