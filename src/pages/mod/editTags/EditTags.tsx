import { useQuery, useQueryClient } from '@tanstack/react-query';
import GetTags from '../../../api/tags/GetTags';
import { Tag } from '../../../api/types/level/Tag';
import { useRef, useState } from 'react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { TextInput } from '../../../components/Input';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { toast } from 'react-toastify';
import SaveTag from '../../../api/tags/SaveTag';
import renderToastError from '../../../utils/renderToastError';
import CreateTag from '../../../api/tags/CreateTag';
import useDeleteTagModal from '../../../hooks/modals/useDeleteTagModal';
import ReorderTag from '../../../api/tags/ReorderTag';

export default function EditTags() {
    const [isMutating, setIsMutating] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag>();
    const nameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);

    const openDeleteTagModal = useDeleteTagModal();

    const queryClient = useQueryClient();
    const { data: tags } = useQuery({
        queryKey: ['tags'],
        queryFn: GetTags,
    });

    function onTagSelect(tag?: Tag) {
        if (tag === undefined || selectedTag?.ID === tag.ID) {
            setSelectedTag(undefined);
            if (nameRef.current) nameRef.current.value = '';
            if (descriptionRef.current) descriptionRef.current.value = '';
            return;
        }

        setSelectedTag(tag);

        if (nameRef.current) nameRef.current.value = tag.Name;
        if (descriptionRef.current) descriptionRef.current.value = tag.Description || '';
    }

    function onSave() {
        if (isMutating) return;
        if (selectedTag === undefined) {
            toast.error('No tag selected');
            return;
        }
        if (!nameRef.current || !descriptionRef.current) return;

        setIsMutating(true);
        toast.promise(SaveTag(selectedTag, nameRef.current.value, descriptionRef.current.value).then(() => {
            queryClient.invalidateQueries(['tags']);
        }).finally(() => setIsMutating(false)), {
            pending: 'Saving...',
            success: 'Saved',
            error: renderToastError,
        });
    }

    function onCreate() {
        if (isMutating) return;
        setIsMutating(true);

        if (!nameRef.current || !descriptionRef.current) return;
        toast.promise(CreateTag(nameRef.current.value, descriptionRef.current.value).then(() => {
            queryClient.invalidateQueries(['tags']);
        }).finally(() => {
            setIsMutating(false)
        }), {
            pending: 'Creating...',
            success: 'Created tag',
            error: renderToastError,
        });
    }

    function onDelete() {
        if (selectedTag === undefined) {
            toast.error('No tag selected');
            return;
        }

        openDeleteTagModal(selectedTag);
    }

    return (
        <div>
            <h3 className='mb-3 text-2xl'>Edit Tags</h3>
            <p>Select tag:</p>
            <LoadingSpinner isLoading={tags === undefined} />
            <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2'>
                {tags?.map((t) => (<TagItem dragLocked={false} tag={t} selected={t === selectedTag} onSelect={onTagSelect} />))}
            </div>
            <div className='mt-4'>
                <div className='mb-2'>
                    <p>Name</p>
                    <TextInput ref={nameRef} />
                </div>
                <div className='mb-1'>
                    <p>Description</p>
                    <TextInput ref={descriptionRef} />
                    <p className='text-gray-400 text-sm'>Short description that is visible in the tooltip</p>
                </div>
                {selectedTag
                    ? <PrimaryButton onClick={onSave}>Save</PrimaryButton>
                    : <SecondaryButton onClick={onCreate}>Create</SecondaryButton>
                }
                <DangerButton className='ms-2' onClick={onDelete}>Delete</DangerButton>
            </div>
        </div>
    );
}

function TagItem({ dragLocked, tag, selected, onSelect }: { dragLocked: boolean, tag: Tag, selected: boolean, onSelect(tag?: Tag): void }) {
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
        const request = ReorderTag(droppedID, tag.Ordering).then(() => {
            queryClient.invalidateQueries(['tags']);
            onSelect();
        });

        toast.promise(request, {
            pending: 'Reordering...',
            success: 'Reordered',
            error: renderToastError,
        });
    }

    return (
        <div draggable={true} onDrop={dropHandler} onDragEnd={dragStopHandler} onDragStart={dragStartHandler} onDragOver={dragOverHandler} onDragLeave={dragLeaveHandler} className={`${isBeingDragged ? 'opacity-0' : ''} ${dragOver ? 'opacity-50' : ''}`}>
            <div onClick={() => onSelect(tag)} className={`${selected ? 'bg-blue-600' : 'bg-gray-500'} cursor-grab p-1 text-center round:rounded`}>
                <p className='select-none'>{tag.Name}</p>
            </div>
        </div>
    );
}