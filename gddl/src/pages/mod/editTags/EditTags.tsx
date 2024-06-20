import { useQuery, useQueryClient } from '@tanstack/react-query';
import GetTags from '../../../api/level/GetTags';
import { Tag } from '../../../api/types/level/Tag';
import { useRef, useState } from 'react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { TextInput } from '../../../components/Input';
import { DangerButton, PrimaryButton, SecondaryButton } from '../../../components/Button';
import { toast } from 'react-toastify';
import SaveTag from '../../../api/tags/SaveTag';
import renderToastError from '../../../utils/renderToastError';
import CreateTag from '../../../api/tags/CreateTag';
import DeleteTag from '../../../api/tags/DeleteTag';
import Modal from '../../../components/Modal';

export default function EditTags() {
    const [isMutating, setIsMutating] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag>();
    const nameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const queryClient = useQueryClient();
    const { data: tags } = useQuery({
        queryKey: ['tags'],
        queryFn: GetTags,
    });

    function onTagSelect(tag: Tag) {
        if (selectedTag?.TagID === tag.TagID) {
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
        toast.promise(SaveTag({ TagID: selectedTag.TagID, Name: nameRef.current.value, Description: descriptionRef.current.value }).then(() => {
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

    function openConfirmModal() {
        if (selectedTag === undefined) {
            toast.error('No tag selected');
            return;
        }

        setShowConfirm(true);
    }

    function onDelete() {
        if (isMutating) return;
        if (selectedTag === undefined) return;
        setIsMutating(true);

        toast.promise(DeleteTag(selectedTag.TagID).then(() => {
            queryClient.invalidateQueries(['tags']);
        }).finally(() => {
            setIsMutating(false);
            setShowConfirm(false);
        }), {
            pending: 'Deleting...',
            success: 'Deleted tag',
            error: renderToastError,
        });
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
                <DangerButton className='ms-2' onClick={openConfirmModal}>Delete</DangerButton>
            </div>
            <Modal title='Are you sure?' show={showConfirm} onClose={() => setShowConfirm(false)}>
                <Modal.Body>
                    <div className='my-6'>
                        <p>This is an irreversible action!</p>
                        <p>All tag submissions using this tag will be deleted!</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className='flex float-right round:gap-1'>
                        <PrimaryButton onClick={() => setShowConfirm(false)}>Cancel</PrimaryButton>
                        <DangerButton onClick={onDelete}>Confirm</DangerButton>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

function TagItem({ dragLocked, tag, selected, onSelect }: { dragLocked: boolean, tag: Tag, selected: boolean, onSelect(tag: Tag): void }) {
    const [isDragged, setIsDragged] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const itemRef = useRef<HTMLLIElement>(null);

    function dragStopHandler() {
        setIsDragged(false);
        console.log('stop ' + tag.Name);
    }

    function dragStartHandler(e: React.DragEvent) {
        //e.preventDefault();

        setDragOver(true);
        console.log('start ' + tag.Name);
    }
    function dragEnterHandler(e: React.DragEvent) {
        e.preventDefault();

        console.log('enter ' + tag.Name);
    }
    function dragLeaveHandler(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();

        e.dataTransfer.dropEffect = 'move';
        setDragOver(false);
        console.log('leave ' + tag.Name);
    }

    return (
        <div draggable={true} onDragEnd={dragStopHandler} onDragStart={dragStartHandler} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onClick={() => onSelect(tag)} className={(selected ? 'bg-blue-600' : 'bg-gray-500') + ' cursor-pointer p-1 text-center round:rounded'}>
            <p className='select-none'>{tag.Name}</p>
        </div>
    );
}