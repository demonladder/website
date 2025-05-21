import { useEffect, useState } from 'react';
import Heading3 from '../../../../components/headings/Heading3';
import Select from '../../../../components/Select';
import useRoles from '../../../../hooks/api/useRoles';
import { PrimaryButton } from '../../../../components/ui/buttons/PrimaryButton';
import { NaNToNull } from '../../../../utils/NaNToNull';
import { toast } from 'react-toastify';
import { updateVerificationRole } from '../api/updateVerificationRole';
import renderToastError from '../../../../utils/renderToastError';
import { useQueryClient } from '@tanstack/react-query';
import { useVerificationRole } from '../hooks/useVerificationRole';

export default function VerificationRoleSelect() {
    const roles = useRoles();
    const verificationRoleQuery = useVerificationRole();
    const [verificationRole, setVerificationRole] = useState(verificationRoleQuery.data?.ID.toString() ?? 'none');
    const queryClient = useQueryClient();

    useEffect(() => {
        if (verificationRoleQuery.isSuccess) {
            setVerificationRole(verificationRoleQuery.data.ID.toString());
        }   
    }, [verificationRoleQuery.data?.ID, verificationRoleQuery.isSuccess]);

    function onSave() {
        const roleID = NaNToNull(parseInt(verificationRole));

        void toast.promise(updateVerificationRole(roleID), {
            pending: 'Saving...',
            success: 'Verification role updated',
            error: renderToastError,
        }).then(() => {
            void queryClient.invalidateQueries(['usersEligibleForVerification']);
            void queryClient.invalidateQueries(['verificationRole']);
            void queryClient.invalidateQueries(['verifiedUsers']);
        });
    }

    return (
        <section className='mt-8'>
            <Heading3>Verification Role</Heading3>
            <p>Select the role used for verification</p>
            {roles.isSuccess && <>
                <Select id='verificationRole' activeKey={verificationRole} onChange={setVerificationRole} options={roles.data.reduce<Record<string, string>>((acc, role) => ({ ...acc, [role.ID]: role.Name }), { none: 'none' })} />
                <PrimaryButton onClick={onSave}>Save</PrimaryButton>
            </>}
        </section>
    );
}
