import { Link } from 'react-router-dom';
import DemonLogo from '../../../components/DemonLogo';
import { IListLevel } from './List';
import List from '../../../api/types/compounds/List';
import { useRef, useState } from 'react';
import useContextMenu from '../../../components/ui/menuContext/useContextMenu';
import { toast } from 'react-toastify';
import RemoveLevel from '../../../api/list/RemoveLevel';
import renderToastError from '../../../utils/renderToastError';
import { useQueryClient } from '@tanstack/react-query';
import useSession from '../../../hooks/useSession';

interface Props {
    list: List;
    listLevel: IListLevel;
    setPosition: (oldPosition: number, newPosition: number) => void;
    dragLocked: boolean;
}

export default function ListLevel({ list, listLevel, setPosition, dragLocked }: Props) {
    const [isDragged, setIsDragged] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const itemRef = useRef<HTMLLIElement>(null);
    const queryClient = useQueryClient();
    const session = useSession();

    const isListOwner = list.OwnerID === session.user?.ID;

    const fixedRating = listLevel.Level.Rating?.toFixed(2);
    const roundedRating = listLevel.Level.Rating !== null ? Math.round(listLevel.Level.Rating) : -1;
    const ratingClass = `tier-${roundedRating}`;

    const fixedEnjoyment = listLevel.Level.Enjoyment?.toFixed(2);
    const roundedEnjoyment = listLevel.Level.Enjoyment !== null ? Math.round(listLevel.Level.Enjoyment) : -1;
    const enjoymentClass = `enj-${roundedEnjoyment}`;

    function dragStartHandler(e: React.DragEvent<HTMLLIElement>) {
        if (dragLocked || !isListOwner) {
            e.preventDefault();
            return;
        }

        e.dataTransfer.setData('text/plain', listLevel.Position.toString());
        e.dataTransfer.dropEffect = 'move';

        setIsDragged(true);

        e.stopPropagation();
    }
    function dragStopHandler() {
        setIsDragged(false);
    }

    function dragOverHandler(e: React.DragEvent) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOver(true);
    }
    function dragLeaveHandler(e: React.DragEvent) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOver(false);
    }

    function dropHandler(e: React.DragEvent<HTMLLIElement>) {
        e.preventDefault();
        setDragOver(false);

        if (itemRef.current === null) return;

        setPosition(parseInt(e.dataTransfer.getData('text/plain')), listLevel.Position);
        (e.currentTarget as HTMLLIElement).parentNode?.insertBefore(itemRef.current, (e.currentTarget as HTMLLIElement));
    }

    function onRemoveLevel() {
        void toast.promise(RemoveLevel(list.ID, listLevel.LevelID).then(() => {
            void queryClient.invalidateQueries(['list', list.ID]);
            void queryClient.invalidateQueries(['user', list.OwnerID, 'lists']);
        }), {
            pending: 'Removing level...',
            success: 'Level removed',
            error: renderToastError,
        });
    }

    const openContext = useContextMenu([
        { type: 'info', text: 'Copy ID', onClick: () => void navigator.clipboard.writeText(listLevel.LevelID.toString()) },
        { type: 'danger', text: 'Remove', onClick: onRemoveLevel },
    ]);

    return (
        <li ref={itemRef} id={listLevel.LevelID.toString()} draggable={true} onDragStart={dragStartHandler} onDragEnd={dragStopHandler} onDragOver={dragOverHandler} onDragLeave={dragLeaveHandler} onDrop={(e) => dropHandler(e)} className={isDragged ? 'opacity-0' : (dragOver ? 'opacity-50' : '')} onContextMenu={openContext}>
            <div className='grid grid-cols-12 max-xl:gap-2 group/menu'>
                <div className={`self-center text-center col-span-1 ${isListOwner ? 'cursor-grab' : ''}`}>
                    {isListOwner
                        ? (<>
                            <b className='group-hover/menu:hidden lg:text-6xl'>{listLevel.Position}.</b>
                            <b className='hidden group-hover/menu:block lg:text-6xl'><i className='bx bx-menu' /></b>
                        </>)
                        : (
                            <b className='lg:text-6xl'>{listLevel.Position}.</b>
                        )
                    }
                </div>
                <Link to={`/level/${listLevel.LevelID}`} className='col-span-11 flex grow bg-theme-700 hover:bg-theme-600'>
                    <div className='w-2/12 lg:w-1/12 p-2 self-center'>
                        <DemonLogo diff={listLevel.Level.Meta?.Difficulty} />
                    </div>
                    <div className='self-center text-sm lg:text-xl mx-6'>
                        <h3 className='lg:text-2xl font-bold break-all whitespace-pre-wrap'>{listLevel.Level.Meta?.Name}</h3>
                        <p className='text-gray-300'><i>{listLevel.Level.Meta?.Creator}</i></p>
                    </div>
                    <div className={'ms-auto w-8 lg:w-32 lg:h-32 grid place-items-center group ' + ratingClass}>
                        <p className='lg:text-3xl group-hover:hidden '>{listLevel.Level.Rating !== null ? roundedRating : 'N/A'}</p>
                        <p className='lg:text-3xl hidden group-hover:block '>{listLevel.Level.Rating !== null ? fixedRating : 'N/A'}</p>
                    </div>
                    <div className={'w-8 lg:w-32 lg:h-32 grid place-items-center group ' + enjoymentClass}>
                        <p className='lg:text-3xl group-hover:hidden '>{listLevel.Level.Enjoyment !== null ? roundedEnjoyment : 'N/A'}</p>
                        <p className='lg:text-3xl hidden group-hover:block '>{listLevel.Level.Enjoyment !== null ? fixedEnjoyment : 'N/A'}</p>
                    </div>
                </Link>
            </div>
        </li>
    );
}
