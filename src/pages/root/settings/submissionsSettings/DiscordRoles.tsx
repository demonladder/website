import { useEffect, useState } from 'react';
import FormInputDescription from '../../../../components/form/FormInputDescription';
import Select from '../../../../components/Select';
import { PrimaryButton } from '../../../../components/Button';
import StorageManager from '../../../../utils/StorageManager';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import GetWants from '../../../../api/user/GetWants';
import UpdateRoleManagementSettings from '../../../../api/notifications/UpdateRoleManagementSettings';
import { toast } from 'react-toastify';
import renderToastError from '../../../../utils/renderToastError';

const hardestManageOptions = {
    1: 'Manual',
    2: 'Only hardest',
    3: 'Every completed tier',
};

export default function DiscordRoles() {
    const [hardestManageKey, setHardestManageKey] = useState('1');
    const user = StorageManager.getUser();
    const queryClient = useQueryClient();

    const { data, status } = useQuery({
        queryKey: ['user', user?.ID, 'wants'],
        queryFn: GetWants,
    });

    useEffect(() => {
        if (data === undefined) {
            return;
        }

        if (data.roleManagement) setHardestManageKey(data.roleManagement);
    }, [data, data?.roleManagement]);

    function submit() {
        void toast.promise(UpdateRoleManagementSettings(hardestManageKey).then(() => queryClient.invalidateQueries(['user', user?.ID, 'wants'])), {
            pending: 'Saving...',
            success: 'Saved',
            error: renderToastError,
        });
    }

    return (
        <>
            <div className='divider my-8 text-gray-400'></div>
            <b>Discord Roles</b>
            <div>
                <Select id='hardestManage' options={hardestManageOptions} activeKey={hardestManageKey} onChange={setHardestManageKey} />
                <FormInputDescription>How your role tier roles in the GDDL Discord server will be managed. Switching between these may remove manually set tier roles!</FormInputDescription>
            </div>
            {user !== null &&
                <PrimaryButton loading={status === 'loading'} onClick={submit} disabled={hardestManageKey === data?.roleManagement}>Save</PrimaryButton>
            }
        </>
    );
}