import { ReactNode } from 'react';
import Modal from '../../layout/Modal';
import { PrimaryButton, SecondaryButton } from '../../ui/buttons';

interface Props {
    onClose: () => void;
    onConfirm: () => void;
    prompt: ReactNode;
}

export function ConfirmationModal({ onClose, onConfirm, prompt }: Props) {
    return (
        <Modal title='Confirm action' show onClose={onClose}>
            <div className='my-4'>{typeof prompt === 'string' ? <p>{prompt}</p> : prompt}</div>
            <div className='flex justify-end gap-2'>
                <PrimaryButton onClick={onConfirm} autoFocus>
                    Ok
                </PrimaryButton>
                <SecondaryButton onClick={() => onClose()}>Cancel</SecondaryButton>
            </div>
        </Modal>
    );
}
