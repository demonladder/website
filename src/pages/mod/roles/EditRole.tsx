import { useNavigate, useParams } from 'react-router-dom';
import { PrimaryButton } from '../../../components/Button';
import { TextInput } from '../../../components/Input';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CheckBox from '../../../components/input/CheckBox';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import GetRoles from '../../../api/roles/GetRoles';
import { permissions } from './permissions';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import SaveRole from '../../../api/roles/SaveRole';
import useDeleteRoleModal from '../../../hooks/modals/useDeleteRoleModal';
import Users from './Users';

export default function EditRole() {
    const roleID = parseInt(useParams().roleID ?? '');
    const [roleName, setRoleName] = useState('');
    const [tempPermissions, setTempPermissions] = useState(0);
    const [isMutating, setIsMutating] = useState(false);
    const queryClient = useQueryClient();

    const navigate = useNavigate();
    const openDeleteRoleModal = useDeleteRoleModal({
        onSucces: () => navigate('/mod/roles'),
    });

    const { data } = useQuery({
        queryKey: ['roles'],
        queryFn: GetRoles,
    });
    const role = useMemo(() => {
        return data?.find((role) => role.ID === roleID);
    }, [data, roleID]);

    useEffect(() => {
        if (role) {
            setRoleName(role.Name);
            setTempPermissions(role.PermissionBitField);
        }
    }, [role]);

    const onSave = useCallback(() => {
        setIsMutating(true);
        void toast.promise(SaveRole(roleID, roleName, tempPermissions).then(() => queryClient.invalidateQueries(['roles'])).finally(() => setIsMutating(false)), {
            pending: 'Saving role...',
            success: 'Role saved',
            error: renderToastError,
        });
    }, [roleName, tempPermissions, roleID, queryClient, setIsMutating]);

    if (Number.isNaN(roleID)) {
        navigate('/mod/roles');
        return;
    }

    return (
        <div>
            <h3 className='text-2xl mb-4'>Edit Role - {role?.Name}</h3>
            <div className='mb-4'>
                <p>Role name</p>
                <TextInput id='roleName' value={roleName} onChange={(e) => setRoleName(e.target.value)} />
                {(role?.PermissionBitField !== tempPermissions || role.Name !== roleName) &&
                    <div className='fixed bottom-0 z-20 left-1/2 -translate-x-1/2 bg-gray-500 px-4 py-2 flex flex-col justify-center'>
                        <p>Changes have been made</p>
                        <PrimaryButton onClick={onSave} disabled={isMutating}>Save</PrimaryButton>
                    </div>
                }
            </div>
            <div>
                <ul>
                    {permissions.map((permission) => (
                        <li className='py-4 border-b border-gray-500' key={permission.ID}>
                            <label htmlFor={`permission-${permission.ID}`}>
                                <b className='cursor-pointer select-none'>{permission.Name}</b>
                                <span className='inline float-right'>
                                    <CheckBox id={`permission-${permission.ID}`} checked={((tempPermissions ?? 0) & permission.Flag) > 0} onChange={() => setTempPermissions((prev) => prev ^ permission.Flag)} />
                                </span>
                            </label>
                            {permission.Description && <p className='mt-3'>{permission.Description}</p>}
                        </li>
                    ))}
                </ul>
            </div>
            <div className='divider my-8' />
            <Users roleID={roleID} />
            {role &&
                <button onClick={() => openDeleteRoleModal(role)} className='mt-2 text-red-500 underline-t'>Delete role "{role?.Name}"</button>
            }
        </div>
    );
}