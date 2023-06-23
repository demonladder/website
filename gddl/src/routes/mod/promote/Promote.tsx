import React, { useState, useEffect } from 'react';
import UserSearchBox from '../../../components/UserSearchBox';
import { PromoteUser, TinyUser } from '../../../api/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

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
        if (promote.isSuccess) {
            return <p>Sucess</p>
        }

        if (promote.error) {
            if ((promote.error as AxiosError).response?.status === 403) {
                return <p>Your permission level is not high enough</p>;
            }

            return <p>An error ocurred</p>;
        }
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
            <div>
                <Response />
            </div>
            <div>
                <b className='mb-0'>Permission levels:</b>
                <ul>
                    <li>0: No permissions</li>
                    <li>1: List helper</li>
                    <li>2: Developer</li>
                    <li>3: Moderator</li>
                    <li>4: Admin</li>
                    <li>5: Owner</li>
                </ul>
            </div>
        </div>
    );
}