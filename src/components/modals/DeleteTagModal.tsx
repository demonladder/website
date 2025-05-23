import { toast } from 'react-toastify';
import { DangerButton } from '../ui/buttons/DangerButton';
import { PrimaryButton } from '../ui/buttons/PrimaryButton';
import Modal from '../Modal';
import DeleteTag from '../../api/tags/DeleteTag';
import renderToastError from '../../utils/renderToastError';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Tag } from '../../api/types/level/Tag';

interface Props {
    tag: Tag;
    onClose: () => void;
}

export default function DeleteTagModal({ tag, onClose: close }: Props) {
    const [isMutating, setIsMutating] = useState(false);
    const queryClient = useQueryClient();

    function onDelete() {
        if (isMutating) return;
        setIsMutating(true);

        void toast.promise(DeleteTag(tag.ID).then(() => {
            void queryClient.invalidateQueries(['tags']);
            close();
        }).finally(() => {
            setIsMutating(false);
        }), {
            pending: 'Deleting...',
            success: 'Deleted tag',
            error: renderToastError,
        });
    }

    return (
        <Modal title='Are you sure?' show={true} onClose={close}>
            <div>
                <div className='my-6'>
                    <p>This is an irreversible action!</p>
                    <p>All tag submissions using this tag will be deleted! Are you sure you want to delete <b>{tag.Name}</b>?</p>
                </div>
            </div>
            <div>
                <div className='flex float-right round:gap-1'>
                    <PrimaryButton onClick={close}>Cancel</PrimaryButton>
                    <DangerButton onClick={onDelete}>Confirm</DangerButton>
                </div>
            </div>
        </Modal>
    );
}
