import CreateListModal from '../../components/modals/CreateListModal';
import useModal from './useModal';

export default function useCreateListModal() {
    const { createModal, closeModal } = useModal();

    function open(userID: number, levelID: number) {
        const ID = `createList-${userID}`;

        createModal(ID, <CreateListModal userID={userID} levelID={levelID} onClose={() => closeModal(ID)} />);
    }

    return open;
}
