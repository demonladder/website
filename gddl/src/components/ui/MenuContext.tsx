import { forwardRef } from 'react';

interface MenuItem {
    text: string;
    onClick?: React.MouseEventHandler;
    danger?: boolean;
}

interface Props {
    point: { x: number, y: number };
    data: MenuItem[];
}

export default forwardRef<HTMLDivElement, Props>((props, ref) => {
    const { point, data } = props;

    return (
        <div ref={ref} style={{ top: `${point.y}px`, left: `${point.x}px` }} className='fixed w-36 z-50 bg-gray-900 text-white round:rounded shadow-2xl cursor-pointer'>
            {data.map((item) => <div onClick={item.onClick} className={'my-1 px-2 py-1 ' + (!item.danger ? 'hover:bg-gray-700' : 'hover:bg-red-600')}>
                {item.text}
            </div>)}
        </div>
    );
});