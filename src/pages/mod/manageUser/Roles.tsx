import { useId, useState } from 'react';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import InlineLoadingSpinner from '../../../components/InlineLoadingSpinner';
import useRoles from '../../../hooks/api/useRoles';
import SearchBox from '../../../components/SearchBox/SearchBox';
import Role from '../../../api/types/Role';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import AddRoleToUser from '../../../api/user/AddRoleToUser';
import renderToastError from '../../../utils/renderToastError';
import RemoveRoleFromUser from '../../../api/user/RemoveRoleFromUser';
import { UserResponse } from '../../../api/user/GetUser';
import Heading3 from '../../../components/headings/Heading3';

export default function Roles({ user }: { user: UserResponse }) {
    const queryClient = useQueryClient();
    const rolesQuery = useRoles();

    const roles = rolesQuery.data?.filter((r) => user.RoleIDs.includes(r.ID.toString()));

    const manageUserAddRoleSearchBox = useId();
    const [addFilter, setAddFilter] = useState<string>('');
    const unacquiredRoles = rolesQuery.data?.filter((r) => !user.RoleIDs.includes(r.ID.toString())).filter((r) => r.Name.toLowerCase().includes(addFilter.toLowerCase())) ?? [];

    const addRoleMutation = useMutation({
        mutationFn: (roleID: number) => AddRoleToUser(user.ID, roleID),
        onSuccess: () => {
            toast.success('Role added!');
            void queryClient.invalidateQueries(['user', user.ID]);
        },
        onError: (error: Error) => toast.error(renderToastError.render({ data: error })),
    });

    const removeRoleMutation = useMutation({
        mutationFn: (roleID: number) => toast.promise(RemoveRoleFromUser(user.ID, roleID), { pending: 'Removing role...', success: 'Role removed', error: renderToastError }),
        onSuccess: () => {
            void queryClient.invalidateQueries(['user', user.ID]);
        },
    });

    function onAddRole(role?: Role) {
        if (role) addRoleMutation.mutate(role.ID);
    }

    return (
        <section>
            <Heading3>Roles</Heading3>
            <div className='mb-4'>
                <SearchBox search={addFilter} onSearchChange={setAddFilter} list={unacquiredRoles} setResult={onAddRole} getLabel={(r) => `${r.Icon ?? ''} ${r.Name}`} getName={(r) => r.Name} overWriteInput={false} status='ready' placeholder='Role' id={manageUserAddRoleSearchBox} />
            </div>
            {rolesQuery.isLoading && <InlineLoadingSpinner />}
            {roles !== undefined &&
                <ul>
                    {roles.map((role) => (
                        <li className='mt-1' key={role.ID}><DangerButton onClick={() => removeRoleMutation.mutate(role.ID)} loading={removeRoleMutation.isLoading}>X</DangerButton> {role.Icon} {role.Name}</li>
                    ))}
                </ul>
            }
        </section>
    );
}
