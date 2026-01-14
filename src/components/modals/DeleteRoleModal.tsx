import { useCallback } from 'react';
import { DangerButton } from '../ui/buttons/DangerButton';
import { SecondaryButton } from '../ui/buttons/SecondaryButton';
import Modal from '../layout/Modal';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import renderToastError from '../../utils/renderToastError';
import Role from '../../api/types/Role';
import { deleteRole } from '../../features/admin/roles/api/deleteRole';

interface Props {
    role: Role;
    onClose: () => void;
    onSucces?: () => void;
}

export default function DeleteRoleModal({ role, onClose: close, onSucces }: Props) {
    const queryClient = useQueryClient();

    const onDeleteRole = useCallback((roleID?: number) => {
        if (roleID === undefined) return;

        void toast.promise(deleteRole(roleID).then(() => {
            void queryClient.invalidateQueries({ queryKey: ['roles'] });
            close();
            if (onSucces) onSucces();
        }), {
            pending: 'Deleting...',
            success: 'Deleted role!',
            error: renderToastError,
        });
    }, [onSucces, close, queryClient]);

    return (
        <Modal title='Delete Role' show={true} onClose={close}>
            <div>
                <p>Are you sure you want to delete the role "{role.Name}"?</p>
            </div>
            <div className='flex place-content-end gap-2'>
                <SecondaryButton onClick={close}>Close</SecondaryButton>
                <DangerButton onClick={() => onDeleteRole(role.ID)}>Delete</DangerButton>
            </div>
        </Modal>
    );
}
