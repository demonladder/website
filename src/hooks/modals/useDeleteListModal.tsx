import DeleteListModal from '../../components/modals/DeleteListModal';
import useModal from './useModal';

export default function useDeleteListModal() {
    const { createModal, closeModal } = useModal();

    function open(list: Parameters<typeof DeleteListModal>[0]['list']) {
        const ID = `deleteList-${list.ID}`;

        createModal(
            ID,
            <DeleteListModal list={list} onClose={() => closeModal(ID)} />,
        );
    }

    return open;
}
