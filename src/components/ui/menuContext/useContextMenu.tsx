import { useContext } from 'react';
import { ButtonData, MenuData } from './MenuContextContainer';
import { MenuContext } from './MenuContext';

export default function useContextMenu(): (data: MenuData) => void;
export default function useContextMenu(buttons: ButtonData[]): (e: React.MouseEvent) => void;
export default function useContextMenu(buttons?: ButtonData[]) {
    const context = useContext(MenuContext);

    if (buttons === undefined) return (data: MenuData) => context?.setMenuData(data);

    function onContextMenu(e: React.MouseEvent) {
        if (context?.menuData?.x === e.clientX && context.menuData.y === e.clientY) {
            // If the context menu is already open at this position, close it
            context.setMenuData(undefined);
            return;
        }

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
