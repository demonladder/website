import { useState } from 'react';
import { FormInputDescription } from '../../../../components/form';
import Select from '../../../../components/shared/input/Select';
import { PrimaryButton } from '../../../../components/ui/buttons';
import { useMutation, useQuery } from '@tanstack/react-query';
import GetWants from '../../../../api/user/GetWants';
import UpdateRoleManagementSettings from '../../../../api/notifications/UpdateRoleManagementSettings';
import { toast } from 'react-toastify';
import renderToastError from '../../../../utils/renderToastError';
import useSession from '../../../../hooks/useSession';
import { AxiosError } from 'axios';
import InlineLoadingSpinner from '../../../../components/ui/InlineLoadingSpinner';

const hardestManageOptions = {
    '1': 'Manual',
    '2': 'Only hardest',
    '3': 'Every completed tier',
};
type HardestManageKey = keyof typeof hardestManageOptions;

export default function DiscordRoles() {
    const session = useSession();
    const { data, status, refetch } = useQuery({
        queryKey: ['user', session.user?.ID, 'wants'],
        queryFn: GetWants,
        enabled: session.user !== undefined,
    });

    if (status === 'pending') return <InlineLoadingSpinner />;
    if (status === 'error') return <p className='text-red-500'>Failed to load role management</p>;

    return <DiscordRolesPresenter data={data} status={status} refetch={refetch} />;
}

interface DiscordRolesPresenterProps {
    data: Awaited<ReturnType<typeof GetWants>>;
    status: 'pending' | 'success' | 'error';
    refetch: () => Promise<unknown>;
}

function DiscordRolesPresenter({ data, status, refetch }: DiscordRolesPresenterProps) {
    const [hardestManageKey, setHardestManageKey] = useState<HardestManageKey>(
        data.roleManagement ? (data.roleManagement as HardestManageKey) : '1',
    );
    const session = useSession();

    const mutation = useMutation({
        mutationFn: UpdateRoleManagementSettings,
        onMutate: () => toast.loading('Saving...'),
        onSuccess: (_data, _vars, toastId) => {
            void refetch();
            toast.update(toastId, { render: 'Saved', type: 'success', isLoading: false, autoClose: null });
        },
        onError: (err: AxiosError, _vars, toastId) => {
            setHardestManageKey(data.roleManagement ? (data.roleManagement as HardestManageKey) : '1');
            if (toastId !== undefined)
                toast.update(toastId, {
                    render: renderToastError.render({ data: err }),
                    type: 'error',
                    isLoading: false,
                    autoClose: null,
                });
        },
    });

    return (
        <section>
            <b>Discord Roles</b>
            <Select
                id='hardestManage'
                options={hardestManageOptions}
                activeKey={hardestManageKey}
                onChange={setHardestManageKey}
            />
            <FormInputDescription>
                How your role tier roles in the GDDL Discord server will be managed. Switching between these may remove
                manually set tier roles!
            </FormInputDescription>
            {session.user !== undefined && (
                <PrimaryButton
                    loading={status === 'pending' || mutation.isPending}
                    onClick={() => mutation.mutate(hardestManageKey)}
                    className='mt-2'
                    disabled={hardestManageKey === data?.roleManagement}
                >
                    Save
                </PrimaryButton>
            )}
        </section>
    );
}
