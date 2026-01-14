import { useCallback, useMemo, useState } from 'react';
import { Modal, ModalContext } from './ModalContext';

export default function ModalProvider({ children }: { children: React.ReactNode }) {
    const [modals, setModals] = useState<Modal[]>([]);

    const addModal = useCallback((modal: Modal) => {
        setModals((prev) => [...prev, modal]);
    }, []);

    const removeModal = useCallback((ID: string) => {
        setModals((prev) => prev.filter((modal) => modal.ID !== ID));
    }, []);

    const contextValue = useMemo(() => ({
        modals,
        addModal,
        removeModal,
    }), [modals, addModal, removeModal]);

    return (
        <ModalContext.Provider value={contextValue}>
            {modals.at(-1)?.element}
            {children}
        </ModalContext.Provider>
    );
}
