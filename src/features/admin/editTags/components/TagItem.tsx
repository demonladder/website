import { useState } from 'react';
import { Tag } from '../../../../api/types/level/Tag';
import { useQueryClient } from '@tanstack/react-query';
import { reorderTag } from '../api/reorderTag';
import { toast } from 'react-toastify';
import renderToastError from '../../../../utils/renderToastError';

interface Props {
    dragLocked: boolean;
    tag: Tag;
    selected: boolean;
    onSelect: (tag?: Tag) => void;
}

export default function TagItem({ dragLocked, tag, selected, onSelect }: Props) {
    const [isBeingDragged, setIsBeingDragged] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const queryClient = useQueryClient();

    function dragStartHandler(e: React.DragEvent) {
        if (dragLocked) {
            e.preventDefault();
            return;
        }

        setIsBeingDragged(true);
        e.dataTransfer.setData('text/plain', tag.ID.toString());
        e.stopPropagation();
    }
    function dragStopHandler() {
        setIsBeingDragged(false);
    }

    function dragOverHandler(e: React.DragEvent) {
        if (isBeingDragged) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOver(true);
    }
    function dragLeaveHandler(e: React.DragEvent) {
        e.preventDefault();
        setDragOver(false);
    }

    function dropHandler(e: React.DragEvent<HTMLDivElement>) {
        setDragOver(false);

        const droppedID = parseInt(e.dataTransfer.getData('text/plain'));
        const request = reorderTag(droppedID, tag.Ordering).then(() => {
            void queryClient.invalidateQueries({ queryKey: ['tags'] });
            onSelect();
        });

        void toast.promise(request, {
            pending: 'Reordering...',
            success: 'Reordered',
            error: renderToastError,
        });
    }

    return (
        <div
            draggable={true}
            onDrop={dropHandler}
            onDragEnd={dragStopHandler}
            onDragStart={dragStartHandler}
            onDragOver={dragOverHandler}
            onDragLeave={dragLeaveHandler}
            className={`${isBeingDragged ? 'opacity-0' : ''} ${dragOver ? 'opacity-50' : ''}`}
        >
            <div
                onClick={() => onSelect(tag)}
                className={`${selected ? 'bg-blue-600' : 'bg-gray-500'} cursor-grab p-1 text-center round:rounded`}
            >
                <p className='select-none'>{tag.Name}</p>
            </div>
        </div>
    );
}
