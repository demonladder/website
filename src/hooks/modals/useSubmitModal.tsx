import { FullLevel } from '../../api/types/compounds/FullLevel';
import SubmitModal from '../../components/modals/SubmitModal';
import StorageManager from '../../utils/StorageManager';
import useModal from './useModal';

export default function useSubmitModal() {
    const { createModal, closeModal } = useModal();
    const userID = StorageManager.getUser()?.ID;

    function open(level: FullLevel) {
        const ID = `submit-${level.ID}`;

        createModal(
            ID,
            <SubmitModal onClose={() => closeModal(ID)} level={level} userID={userID} />,
        );
    }

    return open;
}