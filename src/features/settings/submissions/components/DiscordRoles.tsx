import { useEffect, useRef, useState } from 'react';
import FormInputDescription from '../../../../components/form/FormInputDescription';
import Select from '../../../../components/shared/input/Select';
import { PrimaryButton } from '../../../../components/ui/buttons/PrimaryButton';
import { useMutation, useQuery } from '@tanstack/react-query';
import GetWants from '../../../../api/user/GetWants';
import UpdateRoleManagementSettings from '../../../../api/notifications/UpdateRoleManagementSettings';
import { Id, toast } from 'react-toastify';
import renderToastError from '../../../../utils/renderToastError';
import useSession from '../../../../hooks/useSession';
import { AxiosError } from 'axios';

const hardestManageOptions = {
    '1': 'Manual',
    '2': 'Only hardest',
    '3': 'Every completed tier',
};
type HardestManageKey = keyof typeof hardestManageOptions;

export default function DiscordRoles() {
    const [hardestManageKey, setHardestManageKey] = useState<HardestManageKey>('1');
    const session = useSession();

    const { data, status, refetch } = useQuery({
        queryKey: ['user', session.user?.ID, 'wants'],
        queryFn: GetWants,
        enabled: session.user !== undefined,
    });

    useEffect(() => {
        if (data === undefined) return;

        if (data.roleManagement) setHardestManageKey(data.roleManagement as HardestManageKey);
    }, [data, data?.roleManagement]);

    const toastHandle = useRef<Id | null>(null);
    const mutation = useMutation({
        mutationFn: UpdateRoleManagementSettings,
        onMutate: () => (toastHandle.current = toast.loading('Saving...')),
        onSuccess: () => {
            void refetch();
            toast.update(toastHandle.current!, { render: 'Saved', type: 'success', isLoading: false, autoClose: null });
        },
        onError: (err: AxiosError) =>
            toast.update(toastHandle.current!, {
                render: renderToastError.render({ data: err }),
                type: 'error',
                isLoading: false,
                autoClose: null,
            }),
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
