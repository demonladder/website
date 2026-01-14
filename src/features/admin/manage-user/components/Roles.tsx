import { useId, useState } from 'react';
import { DangerButton } from '../../../../components/ui/buttons/DangerButton';
import InlineLoadingSpinner from '../../../../components/ui/InlineLoadingSpinner';
import useRoles from '../../../../hooks/api/useRoles';
import SearchBox from '../../../../components/SearchBox/SearchBox';
import Role from '../../../../api/types/Role';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import AddRoleToUser from '../../../../api/user/AddRoleToUser';
import renderToastError from '../../../../utils/renderToastError';
import RemoveRoleFromUser from '../../../../api/user/RemoveRoleFromUser';
import { UserResponse } from '../../../../api/user/GetUser';
import Heading3 from '../../../../components/headings/Heading3';
import { useUserRoles } from '../../../../hooks/useUserRoles';

export default function Roles({ user }: { user: UserResponse }) {
    const queryClient = useQueryClient();
    const rolesQuery = useRoles();

    const { data: userRoles } = useUserRoles(user.ID);

    const manageUserAddRoleSearchBox = useId();
    const [addFilter, setAddFilter] = useState<string>('');
    const unacquiredRoles = rolesQuery.data?.filter((r) => !userRoles?.find((ur) => ur.ID === r.ID)).filter((r) => r.Name.toLowerCase().includes(addFilter.toLowerCase())) ?? [];

    const addRoleMutation = useMutation({
        mutationFn: (roleID: number) => AddRoleToUser(user.ID, roleID),
        onSuccess: () => {
            toast.success('Role added!');
            void queryClient.invalidateQueries({ queryKey: ['user', user.ID] });
        },
        onError: (error: Error) => void toast.error(renderToastError.render({ data: error })),
    });

    const removeRoleMutation = useMutation({
        mutationFn: (roleID: number) => toast.promise(RemoveRoleFromUser(user.ID, roleID), { pending: 'Removing role...', success: 'Role removed', error: renderToastError }),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['user', user.ID] });
        },
    });

    function onAddRole(role?: Role) {
        if (role) addRoleMutation.mutate(role.ID);
    }

    return (
        <section className='bg-theme-700 border border-theme-outline p-4 round:rounded-xl'>
            <Heading3>Roles</Heading3>
            <div className='mb-4'>
                <SearchBox
                    value={addFilter}
                    onChange={setAddFilter}
                    list={unacquiredRoles}
                    onResult={onAddRole}
                    getLabel={(r) => `${r.Icon ?? ''} ${r.Name}`}
                    getName={(r) => r.Name}
                    overWriteInput={false}
                    status='ready'
                    placeholder='Role'
                    id={manageUserAddRoleSearchBox}
                />
            </div>
            {rolesQuery.isPending && <InlineLoadingSpinner />}
            {userRoles !== undefined &&
                <ul>
                    {userRoles.map((role) => (
                        <li className='mt-1' key={role.ID}><DangerButton onClick={() => removeRoleMutation.mutate(role.ID)} loading={removeRoleMutation.isPending}>X</DangerButton> {role.Icon} {role.Name}</li>
                    ))}
                </ul>
            }
        </section>
    );
}
