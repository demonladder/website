import { useCallback } from 'react';
import SubmitModal from '../../components/modals/SubmitModal';
import useModal from './useModal';
import useSession from '../useSession';
import { toast } from 'react-toastify';

export default function useSubmitModal() {
    const { createModal, closeModal } = useModal();

    const session = useSession();

    const open = useCallback(
        (level: Parameters<typeof SubmitModal>[0]['level']) => {
            if (!session.user) return toast.error('You must be logged in to submit ratings!');

            const ID = `submit-${level.ID}`;
            createModal(ID, <SubmitModal onClose={() => closeModal(ID)} level={level} userID={session.user.ID} />);
        },
        [session, closeModal, createModal],
    );

    return open;
}
