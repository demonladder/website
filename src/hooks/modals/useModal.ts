import { useContext } from 'react';
import { ModalContext } from '../../context/modal/ModalContext';

export default function useModal() {
    const modalContext = useContext(ModalContext);

    return {
        createModal: (ID: string, modal: React.ReactNode) => modalContext.addModal({ ID, element: modal }),
        closeModal: (ID: string) => modalContext.removeModal(ID),
    };
}
