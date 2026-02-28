import { useNavigate, useParams } from 'react-router';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { TextInput } from '../../../components/shared/input/Input';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CheckBox from '../../../components/input/CheckBox';
import { useQueryClient } from '@tanstack/react-query';
import useRoles from '../../../hooks/api/useRoles';
import { permissions } from './permissions';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import { rolesClient } from '../../../api';
import useDeleteRoleModal from '../../../hooks/modals/useDeleteRoleModal';
import Users from './components/Users';
import FormInputDescription from '../../../components/form/FormInputDescription';
import FormInputLabel from '../../../components/form/FormInputLabel';
import { Heading2, Heading3 } from '../../../components/headings';
import Divider from '../../../components/divider/Divider';

export default function EditRole() {
    const roleID = parseInt(useParams().roleID ?? '');
    const [roleName, setRoleName] = useState('');
    const [tempPermissions, setTempPermissions] = useState(0);
    const [isMutating, setIsMutating] = useState(false);
    const [color, setColor] = useState('');
    const queryClient = useQueryClient();

    const navigate = useNavigate();
    const openDeleteRoleModal = useDeleteRoleModal({
        onSuccess: () => void navigate('/mod/roles'),
    });

    const { data } = useRoles();
    const role = useMemo(() => {
        return data?.find((role) => role.ID === roleID);
    }, [data, roleID]);

    useEffect(() => {
        if (role) {
            setRoleName(role.Name);
            setTempPermissions(role.PermissionBitField);
            setColor(role.Color?.toString(16).padStart(6, '0') ?? '');
        }
    }, [role]);

    const onSave = useCallback(() => {
        setIsMutating(true);
        void toast.promise(
            rolesClient
                .update(roleID, {
                    color: color ? parseInt(color, 16) : null,
                    name: roleName,
                    permissions: tempPermissions,
                })
                .then(() => queryClient.invalidateQueries({ queryKey: ['roles'] }))
                .finally(() => setIsMutating(false)),
            {
                pending: 'Saving role...',
                success: 'Role saved',
                error: renderToastError,
            },
        );
    }, [roleID, color, roleName, tempPermissions, queryClient]);

    if (Number.isNaN(roleID)) {
        void navigate('/mod/roles');
        return;
    }

    return (
        <>
            <Heading2>Edit Role - {role?.Name}</Heading2>
            <section className='my-4'>
                <FormInputLabel>Role name</FormInputLabel>
                <TextInput id='roleName' value={roleName} onChange={(e) => setRoleName(e.target.value)} />
                {(role?.PermissionBitField !== tempPermissions ||
                    role.Name !== roleName ||
                    (role.Color !== null && role.Color.toString(16).padStart(6, '0') !== color)) && (
                    <div className='fixed bottom-0 z-20 left-1/2 -translate-x-1/2 bg-theme-500 px-4 py-2 flex flex-col justify-center'>
                        <p>Changes have been made</p>
                        <PrimaryButton onClick={onSave} disabled={isMutating}>
                            Save
                        </PrimaryButton>
                    </div>
                )}
            </section>
            <section className='mb-4 flex gap-8'>
                <div className='grow'>
                    <FormInputLabel>Role color</FormInputLabel>
                    <TextInput
                        id='roleColor'
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder='Hex color code'
                    />
                    <FormInputDescription>
                        Use a hex color code, e.g. #ff0000. Go find a color picker, I'm too lazy for this shi
                    </FormInputDescription>
                </div>
                <div className='w-24 h-24' style={{ backgroundColor: `#${color}` }} />
            </section>
            <section>
                <Heading3>Permissions</Heading3>
                <ul>
                    {permissions.map((permission) => (
                        <li className='py-4 border-b border-gray-500' key={permission.ID}>
                            <label htmlFor={`permission-${permission.ID}`}>
                                <b className='cursor-pointer select-none'>{permission.Name}</b>
                                <span className='inline float-right'>
                                    <CheckBox
                                        id={`permission-${permission.ID}`}
                                        checked={((tempPermissions ?? 0) & permission.Flag) > 0}
                                        onChange={() => setTempPermissions((prev) => prev ^ permission.Flag)}
                                    />
                                </span>
                            </label>
                            {permission.Description && <p className='mt-3'>{permission.Description}</p>}
                        </li>
                    ))}
                </ul>
            </section>
            <Divider />
            <Users roleID={roleID} />
            {role && (
                <button onClick={() => openDeleteRoleModal(role)} className='mt-8 text-red-500 underline-t'>
                    Delete role "{role?.Name}"
                </button>
            )}
        </>
    );
}
