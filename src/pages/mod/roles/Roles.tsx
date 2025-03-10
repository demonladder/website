import { useQuery, useQueryClient } from '@tanstack/react-query';
import GetRoles from '../../../api/roles/GetRoles';
import { TextInput } from '../../../components/Input';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import CreateRole from '../../../api/roles/CreateRole';

export default function Roles() {
    const [search, setSearch] = useState('');
    const [isMutating, setIsMutating] = useState(false);
    const { data } = useQuery({
        queryKey: ['roles'],
        queryFn: GetRoles,
    });

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const filteredRoles = useMemo(() => {
        return data?.filter((role) => role.Name.toLowerCase().includes(search.toLowerCase()));
    }, [data, search]);

    const onCreate = useCallback(() => {
        setIsMutating(true);
        toast.promise(CreateRole(search).then(() => queryClient.invalidateQueries(['roles'])).finally(() => setIsMutating(false)), {
            pending: 'Creating role...',
            success: 'Role created',
            error: renderToastError,
        });
    }, [search, queryClient, setIsMutating]);

    return (
        <div>
            <h3 className='text-2xl mb-4'>Roles</h3>
            <div className='mb-4'>
                <TextInput id='roleSearch' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search role' />
                <PrimaryButton onClick={onCreate} disabled={isMutating}>Create</PrimaryButton>
            </div>
            {filteredRoles !== undefined &&
                <ul>
                    {filteredRoles.map((role) => (
                        <li className='py-3 ps-3 border-b border-gray-500 hover:bg-gray-500 cursor-pointer' onClick={() => navigate(`/mod/roles/${role.ID}`)} key={role.ID}>{role.Icon ?? ''} {role.Name}</li>
                    ))}
                </ul>
            }
        </div>
    );
}