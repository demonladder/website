import React, { useState, useEffect } from 'react';
import UserSearchBox from '../../../components/UserSearchBox';
import { PromoteUser, TinyUser } from '../../../api/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import LoadingSpinner from '../../../components/LoadingSpinner';
import WarningBox from '../../../components/message/WarningBox';
import SuccessBox from '../../../components/message/SuccessBox';

export default function Promote() {
    const [result, setResult] = useState<TinyUser>();
    const [permissionLevel, setPermissionLevel] = useState(0);

    const queryClient = useQueryClient();
    const promote = useMutation({
        mutationFn: async ({ userID, permissionLevel }: { userID: number, permissionLevel: number }) => {
            await PromoteUser(userID, permissionLevel)
            queryClient.invalidateQueries(['userSearch']);
        },
    });

    useEffect(() => {
        setPermissionLevel(result?.PermissionLevel || 0);
    }, [result]);

    function submit() {
        if (result === undefined) return;

        promote.mutate({ userID: result.ID, permissionLevel });
    }

    function Response() {
        if (promote.error) {
            if ((promote.error as AxiosError).response?.status === 403) {
                return <WarningBox text='Your permission level is not high enough!' />;
            }

            return <WarningBox text='An error ocurred!' />;
        }

        if (promote.status === 'success') return <SuccessBox text='Success' />;

        if (promote.status === 'loading') return <LoadingSpinner />;
    }

    return (
        <div>
            <h3 className='mb-3'>Promote User</h3>
            <div className='mb-3'>
                <label htmlFor='promoteUser'>Username:</label>
                <UserSearchBox setResult={setResult} id='promoteUser' />
            </div>
            <div className='mb-3'>
                <label htmlFor='permissionLevel'>Permission level:</label>
                <input type='number' value={permissionLevel} id='permissionLevel' onChange={(e) => setPermissionLevel(parseInt(e.target.value))} />
                <button onClick={submit} className={'primary' + ((result?.PermissionLevel !== permissionLevel && result !== undefined) ? '' : ' d-none')}>Save</button>
            </div>
            <Response />
            <div>
                <b className='mb-0'>Permission levels:</b>
                <ol start={0}>
                    <li>No permissions</li>
                    <li>List helper</li>
                    <li>Developer</li>
                    <li>Moderator</li>
                    <li>Admin</li>
                    <li>Owner</li>
                </ol>
            </div>
        </div>
    );
}