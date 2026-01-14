import { useQueryClient } from '@tanstack/react-query';
import { Tag } from '../../../api/types/level/Tag';
import { useRef, useState } from 'react';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import { TextInput } from '../../../components/shared/input/Input';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { toast } from 'react-toastify';
import { saveTag } from './api/saveTag';
import renderToastError from '../../../utils/renderToastError';
import { createTag } from './api/createTag';
import useDeleteTagModal from '../../../hooks/modals/useDeleteTagModal';
import { useTags } from '../../../hooks/api/tags/useTags';
import TagItem from './components/TagItem';

export default function EditTags() {
    const [isMutating, setIsMutating] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag>();
    const nameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);

    const openDeleteTagModal = useDeleteTagModal();

    const queryClient = useQueryClient();
    const { data: tags } = useTags();

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
        void toast.promise(saveTag(selectedTag, nameRef.current.value, descriptionRef.current.value).then(() => {
            void queryClient.invalidateQueries({ queryKey: ['tags'] });
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
        void toast.promise(createTag(nameRef.current.value, descriptionRef.current.value).then(() => {
            void queryClient.invalidateQueries({ queryKey: ['tags'] });
        }).finally(() => {
            setIsMutating(false);
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
