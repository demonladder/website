import { createContext } from 'react';

export interface Modal {
    ID: string;
    element: React.ReactNode;
}

interface IModalContext {
    modals: Modal[];
    addModal: (modal: Modal) => void;
    removeModal: (ID: string) => void;
}

const defaultContext: IModalContext = {
    modals: [],
    addModal: () => { },
    removeModal: () => { },
};

export const ModalContext = createContext(defaultContext);
