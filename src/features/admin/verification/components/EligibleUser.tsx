import { Link } from 'react-router';
import { Heading4 } from '../../../../components/headings';
import LoadingSpinner from '../../../../components/shared/LoadingSpinner';
import useUserQuery from '../../../../hooks/queries/useUserQuery';
import { PrimaryButton } from '../../../../components/ui/buttons/PrimaryButton';
import { toast } from 'react-toastify';
import renderToastError from '../../../../utils/renderToastError';
import { UserStat } from './UserStat';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { verifyUser } from '../api/verifyUser';

interface Props {
    userID: number;
    submissions: number;
    distinctApprovals: number;
}

export default function EligibleUser({ userID, submissions, distinctApprovals }: Props) {
    const user = useUserQuery(userID);
    const queryClient = useQueryClient();

    const verifyMutation = useMutation({
        mutationFn: () => verifyUser(userID),
    });

    function onVerify() {
        void toast
            .promise(verifyMutation.mutateAsync(), {
                pending: 'Verifying user...',
                success: 'User verified!',
                error: renderToastError,
            })
            .then(() => {
                void user.refetch();
                void queryClient.invalidateQueries({ queryKey: ['verifiedUsers'] });
                void queryClient.invalidateQueries({ queryKey: ['usersEligibleForVerification'] });
            });
    }

    return (
        <div className='bg-theme-600 px-4 py-2 round:rounded-lg relative'>
            {user.isPending && <LoadingSpinner />}
            {user.isSuccess && (
                <>
                    <Heading4 className='flex gap-2'>
                        {user.data.avatar ? (
                            <img
                                src={`https://cdn.gdladder.com/avatars/${user.data.ID}/${user.data.avatar}.png`}
                                width='56'
                                height='56'
                                className='inline-block size-14 rounded-full'
                                alt='Profile'
                            />
                        ) : (
                            <i className='bx bxs-user-circle text-6xl' />
                        )}
                        <div className='flex flex-col justify-around'>
                            <Link to={`/profile/${userID}`} className='underline'>
                                {user.data.Name}
                            </Link>
                            {user.data.CompletedPacks.length > 0 && (
                                <div>
                                    {user.data.CompletedPacks.map((pack) => (
                                        <Link to={`/pack/${pack.PackID}`} key={pack.PackID}>
                                            <img
                                                src={`/packIcons/${pack.IconName}`}
                                                className='inline-block me-1 w-6'
                                            />
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Heading4>
                    <div className='grid grid-cols-2 gap-2 mt-4'>
                        <UserStat label='Eligible submissions'>{submissions}</UserStat>
                        <UserStat
                            label='Distinct approvals'
                            title='The number of distinct users who have approved the users submissions'
                        >
                            {distinctApprovals}
                        </UserStat>
                        <UserStat label='Total submissions'>{user.data.SubmissionCount}</UserStat>
                        <UserStat label='Average enjoyment'>{user.data.AverageEnjoyment?.toFixed(2) ?? '-'}</UserStat>
                        <UserStat label='Pending'>{user.data.PendingSubmissionCount}</UserStat>
                    </div>
                    <div className='flex mt-4'>
                        <PrimaryButton className='grow' onClick={onVerify} loading={verifyMutation.isPending}>
                            Verify
                        </PrimaryButton>
                    </div>
                </>
            )}
        </div>
    );
}
