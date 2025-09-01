import useModal from '../../../hooks/modals/useModal';
import CreateApplicationModal from '../modals/create-application.modal';

export function useCreateApplicationModal() {
    const { createModal, closeModal } = useModal();

    function open() {
        const ID = `createApplication`;

        createModal(ID, <CreateApplicationModal onClose={() => closeModal(ID)} />);
    }

    return open;
}
