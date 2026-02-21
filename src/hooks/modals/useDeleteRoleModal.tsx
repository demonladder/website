import Role from '../../api/types/Role';
import DeleteRoleModal from '../../components/modals/DeleteRoleModal';
import useModal from './useModal';

interface Options {
    onSuccess?: () => void;
}

export default function useDeleteRoleModal(options?: Options) {
    const { createModal, closeModal } = useModal();

    function open(role: Role) {
        const ID = `deleteRole-${role.ID}`;

        createModal(ID, <DeleteRoleModal role={role} onClose={() => closeModal(ID)} onSuccess={options?.onSuccess} />);
    }

    return open;
}
