import { ReactNode } from 'react';
import useModal from '../../../hooks/modals/useModal';
import { ConfirmationModal } from './ConfirmationModal';

interface Options {
    prompt: ReactNode;
    onConfirm: () => void;
}

export function useConfirmationModal({ prompt, onConfirm }: Options) {
    const { createModal, closeModal } = useModal();

    function open() {
        const ID = 'confirm';

        createModal(
            ID,
            <ConfirmationModal
                onClose={() => closeModal(ID)}
                onConfirm={() => {
                    onConfirm();
                    closeModal(ID);
                }}
                prompt={prompt}
            />,
        );
    }

    return open;
}
