import CreateListModal from '../../components/modals/CreateListModal';
import useModal from './useModal';

export default function useCreateListModal() {
    const { createModal, closeModal } = useModal();

    function open(userID: number) {
        const ID = `createList-${userID}`;

        createModal(
            ID,
            <CreateListModal userID={userID} onClose={() => closeModal(ID)} />,
        );
    }

    return open;
}