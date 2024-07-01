import AddLevelToListModal from '../../components/modals/AddLevelToListModal';
import useModal from './useModal';

export default function useAddListLevelModal() {
    const { createModal, closeModal } = useModal();

    function open(userID: number, levelID: number) {
        const ID = `addLevelToList-${userID}-${levelID}`;

        createModal(
            ID,
            <AddLevelToListModal onClose={() => closeModal(ID)} userID={userID} levelID={levelID} />,
        );
    }

    return open;
}