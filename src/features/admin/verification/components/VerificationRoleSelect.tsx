import { useState } from 'react';
import { Heading3 } from '../../../../components/headings';
import Select from '../../../../components/shared/input/Select';
import useRoles from '../../../../hooks/api/useRoles';
import { PrimaryButton } from '../../../../components/ui/buttons/PrimaryButton';
import { NaNToNull } from '../../../../utils/NaNToNull';
import { toast } from 'react-toastify';
import { updateVerificationRole } from '../api/updateVerificationRole';
import renderToastError from '../../../../utils/renderToastError';
import { useQueryClient } from '@tanstack/react-query';
import { useVerificationRole } from '../hooks/useVerificationRole';
import InlineLoadingSpinner from '../../../../components/ui/InlineLoadingSpinner';

export default function VerificationRoleSelect() {
    const roles = useRoles();
    const verificationRoleQuery = useVerificationRole();

    if (verificationRoleQuery.isLoading || roles.isLoading) return <InlineLoadingSpinner />;
    if (verificationRoleQuery.isError || roles.isError) return <p>Error loading verification role</p>;

    return (
        <VerificationRoleSelectPresenter
            currentVerificationRoleId={verificationRoleQuery.data?.ID}
            roles={roles}
            key={verificationRoleQuery.data?.ID}
        />
    );
}

interface VerificationRoleSelectPresenterProps {
    currentVerificationRoleId?: number;
    roles: ReturnType<typeof useRoles>;
}

function VerificationRoleSelectPresenter({ currentVerificationRoleId, roles }: VerificationRoleSelectPresenterProps) {
    const [verificationRole, setVerificationRole] = useState(currentVerificationRoleId?.toString() ?? 'none');

    const queryClient = useQueryClient();
    const onSave = () => {
        const roleID = NaNToNull(parseInt(verificationRole));

        void toast
            .promise(updateVerificationRole(roleID), {
                pending: 'Saving...',
                success: 'Verification role updated',
                error: renderToastError,
            })
            .then(() => {
                void queryClient.invalidateQueries({ queryKey: ['usersEligibleForVerification'] });
                void queryClient.invalidateQueries({ queryKey: ['verificationRole'] });
                void queryClient.invalidateQueries({ queryKey: ['verifiedUsers'] });
            });
    };

    return (
        <section className='mt-8'>
            <Heading3>Verification Role</Heading3>
            <p>Select the role used for verification</p>
            {roles.isSuccess && (
                <>
                    <Select
                        id='verificationRole'
                        activeKey={verificationRole}
                        onChange={setVerificationRole}
                        options={roles.data.reduce<Record<string, string>>(
                            (acc, role) => ({ ...acc, [role.ID]: role.Name }),
                            { none: 'none' },
                        )}
                    />
                    <PrimaryButton onClick={onSave}>Save</PrimaryButton>
                </>
            )}
        </section>
    );
}
