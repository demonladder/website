import { useContext } from 'react';
import { ButtonData, MenuData } from './MenuContextContainer';
import { MenuContext } from './MenuContext';

export default function useContextMenu(): (data: MenuData) => void;
export default function useContextMenu(buttons: ButtonData[]): (e: React.MouseEvent) => void;
export default function useContextMenu(buttons?: ButtonData[]) {
    const context = useContext(MenuContext);

    if (buttons === undefined) return (data: MenuData) => context?.setMenuData(data);

    function onContextMenu(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        context?.setMenuData({
            buttons: buttons!,  // TypeScript doesn't understand that buttons is not undefined here
            x: e.clientX,
            y: e.clientY,
        });
    }

    return onContextMenu;
}
