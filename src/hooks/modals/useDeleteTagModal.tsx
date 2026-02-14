import { Tag } from '../../api/types/level/Tag';
import DeleteTagModal from '../../components/modals/DeleteTagModal';
import useModal from './useModal';

export default function useDeleteTagModal() {
    const { createModal, closeModal } = useModal();

    function open(tag: Tag) {
        const ID = `deleteTag-${tag.ID}`;

        createModal(ID, <DeleteTagModal onClose={() => closeModal(ID)} tag={tag} />);
    }

    return open;
}
